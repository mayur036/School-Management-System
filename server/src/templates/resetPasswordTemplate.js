/**
 * HTML email template for resetting password.
 * @param {Object} params
 * @param {string} params.name - The recipient's first/last name
 * @param {string} params.resetUrl - The frontend link to reset password page (including token)
 * @param {string} [params.expiryText='1 hour'] - Time limit text
 * @returns {string} Fully styled HTML email body
 */
export const resetPasswordTemplate = ({
  name,
  resetUrl,
  expiryText = '1 hour',
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          color: #334155;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 580px;
          margin: 40px auto;
          padding: 40px;
          background-color: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
          border: 1px solid #f1f5f9;
        }
        .header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo {
          font-size: 24px;
          font-weight: 800;
          color: #4f46e5;
          text-decoration: none;
          letter-spacing: -0.025em;
        }
        .headline {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .paragraph {
          font-size: 15px;
          line-height: 1.625;
          color: #475569;
          margin-top: 0;
          margin-bottom: 24px;
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        .button {
          display: inline-block;
          background-color: #4f46e5;
          color: #ffffff !important;
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          padding: 12px 32px;
          border-radius: 10px;
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        .footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
          font-size: 13px;
          color: #94a3b8;
        }
        .warning {
          font-size: 13px;
          background-color: #fef3c7;
          color: #92400e;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          border-left: 4px solid #f59e0b;
        }
        .link-text {
          word-break: break-all;
          color: #6366f1;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">CampusCore</a>
        </div>
        
        <h1 class="headline">Password Reset Request</h1>
        
        <p class="paragraph">Hello ${name},</p>
        
        <p class="paragraph">
          We received a request to reset the password associated with your CampusCore account. Click the button below to secure your account and set a new password:
        </p>
        
        <div class="button-container">
          <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
        </div>

        <div class="warning">
          <strong>Security Notice:</strong> This link is valid for <strong>${expiryText}</strong>. If you did not make this request, you can safely ignore this email — your password will remain secure and unchanged.
        </div>
        
        <p class="paragraph">
          If you have trouble clicking the button, copy and paste the URL below into your web browser:
          <br>
          <a href="${resetUrl}" class="link-text" target="_blank">${resetUrl}</a>
        </p>
        
        <div class="footer">
          <p>This is an automated message from CampusCore. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} CampusCore. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
