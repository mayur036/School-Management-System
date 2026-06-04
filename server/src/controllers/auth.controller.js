import { isProduction } from '../config/env.js';
import { ApiError } from '../middleware/error.js';
import authModel from '../models/auth.model.js';
import { asyncHandler, ok } from '../utils/apiResponse.js';
import { signToken } from '../utils/jwt.js';
import { comparePassword } from '../utils/password.js';

const COOKIE_NAME = 'token';

// Shared cookie attributes. clearCookie must match these (minus maxAge)
// or the browser won't remove the cookie on logout.
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict',
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

  return ok(res, { user }, 'User details retrieved successfully');
});

export { getMe, login, logout };
