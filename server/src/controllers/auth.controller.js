import crypto from 'crypto';

import { env, isProduction } from '../config/env.js';
import { googleClient } from '../config/googleClient.js';
import { sendEmail } from '../config/mailer.js';
import { ApiError } from '../middleware/error.js';
import authModel from '../models/auth.model.js';
import { resetPasswordTemplate } from '../templates/resetPasswordTemplate.js';
import { asyncHandler, ok } from '../utils/apiResponse.js';
import { signToken } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';

const COOKIE_NAME = 'token';

// Shared cookie attributes. clearCookie must match these (minus maxAge)
// or the browser won't remove the cookie on logout.
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'strict',
  path: '/',
};

const TOKEN_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days (matches JWT_EXPIRES_IN)

/**
 * @desc    Authenticate user and login
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Fetch user
  const user = await authModel.findUserByEmail(email);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // 2. Check active status
  if (user.status !== 'active') {
    throw new ApiError(
      403,
      'Account is inactive. Please contact your administrator.'
    );
  }

  // 3. Check school active status
  if (user.role_name !== 'super_admin' && user.school_status === 'inactive') {
    throw new ApiError(
      403,
      'Your school account is currently inactive. Please contact the system administrator.'
    );
  }

  // 3. Verify password
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 4. Generate JWT token
  const token = signToken({
    staff_id: user.staff_id,
    role_name: user.role_name,
    school_id: user.school_id,
    department_id: user.department_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });

  // 5. Set the httpOnly auth cookie (the token never leaves the cookie)
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: TOKEN_TTL_MS });

  // Remove password hash from response
  delete user.password_hash;

  return ok(res, { user }, 'Login successful');
});

/**
 * @desc    Authenticate user via a Google ID token and login
 * @route   POST /api/auth/google-login
 * @access  Public
 */
const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  // 1. Verify the Google ID token (signature + audience). Never trust the email
  //    until the token is verified against our client id.
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.google.clientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError(401, 'Invalid Google credential');
  }

  if (!payload?.email || payload.email_verified !== true) {
    throw new ApiError(401, 'Google account email is not verified');
  }

  // 2. Look up an existing staff member by the verified email. Google login does
  //    not provision accounts — staff are created by admins.
  const user = await authModel.findUserByEmail(payload.email);
  if (!user) {
    throw new ApiError(
      404,
      'No CampusCore account found for this Google email'
    );
  }

  // 3. Check active status
  if (user.status !== 'active') {
    throw new ApiError(
      403,
      'Account is inactive. Please contact your administrator.'
    );
  }

  // 4. Check school active status
  if (user.role_name !== 'super_admin' && user.school_status === 'inactive') {
    throw new ApiError(
      403,
      'Your school account is currently inactive. Please contact the system administrator.'
    );
  }

  // 5. Generate JWT token (identical claims to password login)
  const token = signToken({
    staff_id: user.staff_id,
    role_name: user.role_name,
    school_id: user.school_id,
    department_id: user.department_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  });

  // 6. Set the httpOnly auth cookie (same options as password login)
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: TOKEN_TTL_MS });

  // Remove password hash from response
  delete user.password_hash;

  return ok(res, { user }, 'Login successful');
});

/**
 * @desc    Logout user and clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  return ok(res, null, 'Logged out successfully');
});

/**
 * @desc    Get currently authenticated user details
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authModel.findStaffById(req.user.staff_id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'Account is inactive');
  }

  if (user.role_name !== 'super_admin' && user.school_status === 'inactive') {
    throw new ApiError(403, 'Your school account is currently inactive');
  }

  return ok(res, { user }, 'User details retrieved successfully');
});

export { getMe, googleLogin, login, logout };

/**
 * @desc    Request password reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await authModel.findUserByEmail(email);
  if (!user) {
    // To prevent email enumeration, return success message even if email not found
    return ok(
      res,
      null,
      'If the email exists in our system, a password reset link has been sent.'
    );
  }

  if (user.status !== 'active') {
    throw new ApiError(
      403,
      'Account is inactive. Please contact your administrator.'
    );
  }

  // Generate a secure, unique token
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

  // Save token and expiry in DB (pass Date object directly for correct timezone alignment)
  await authModel.setResetToken(email, token, expiry);

  const resetUrl = `${env.client.url}/reset-password?token=${token}`;

  const htmlContent = resetPasswordTemplate({
    name: `${user.first_name} ${user.last_name || ''}`.trim(),
    resetUrl,
    expiryText: '1 hour',
  });

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your CampusCore password',
      html: htmlContent,
    });
  } catch (error) {
    console.error('Mailer error:', error);
    throw new ApiError(
      500,
      'Could not send reset email. Please try again later.'
    );
  }

  return ok(
    res,
    null,
    'If the email exists in our system, a password reset link has been sent.'
  );
});

/**
 * @desc    Reset password using link token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await authModel.getUserByResetToken(token);
  if (!user) {
    throw new ApiError(400, 'Invalid or expired password reset token.');
  }

  const expiryTime = new Date(user.reset_token_expiry).getTime();
  if (Date.now() > expiryTime) {
    throw new ApiError(400, 'Password reset token has expired.');
  }

  // Hash new password and update in DB
  const passwordHash = await hashPassword(password);
  await authModel.resetPasswordByToken(token, passwordHash);

  return ok(
    res,
    null,
    'Password reset successful. You can now login with your new password.'
  );
});
