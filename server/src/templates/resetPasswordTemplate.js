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
      background-color: #eef2f7;
      font-family: Arial, Helvetica, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      padding: 40px 0;
      background-color: #eef2f7;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #dbe3ee;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #0f172a, #1d4ed8);
      padding: 34px 40px;
      text-align: center;
    }
    .logo {
      text-decoration: none;
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .content {
      padding: 42px 40px 36px;
    }
    .eyebrow {
      margin: 0 0 12px 0;
      font-size: 13px;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .headline {
      margin: 0 0 16px 0;
      font-size: 30px;
      line-height: 1.2;
      color: #0f172a;
      font-weight: 800;
    }
    .paragraph {
      margin: 0 0 16px 0;
      font-size: 16px;
      line-height: 1.7;
      color: #475569;
    }
    .button-container {
      text-align: center;
      margin: 32px 0 24px;
    }
    .button {
      display: inline-block;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
    }
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2563eb;
      border-radius: 12px;
      padding: 18px 20px;
      margin: 24px 0;
    }
    .info-card p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #334155;
    }
    .warning-box {
      background: #fff7ed;
      border: 1px solid #fed7aa;
      border-left: 4px solid #f97316;
      border-radius: 12px;
      padding: 18px 20px;
      margin: 24px 0;
    }
    .warning-text {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #9a3412;
    }
    .link-text {
      color: #2563eb;
      word-break: break-all;
      text-decoration: none;
    }
    .footer {
      background: #f8fafc;
      padding: 22px 40px;
      text-align: center;
      font-size: 13px;
      line-height: 1.6;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 0 0 6px 0;
    }
    .footer p:last-child {
      margin-bottom: 0;
    }
    @media only screen and (max-width: 600px) {
      .content,
      .header,
      .footer {
        padding-left: 20px;
        padding-right: 20px;
      }
      .headline {
        font-size: 24px;
      }
      .button {
        display: block;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="#" class="logo">CampusCore</a>
      </div>

      <div class="content">
        <p class="eyebrow">Password reset</p>
        <h1 class="headline">Reset your password</h1>

        <p class="paragraph">Hello ${name},</p>

        <p class="paragraph">
          We received a request to reset the password for your CampusCore account. To continue, click the button below and choose a new password.
        </p>

        <div class="button-container">
          <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
        </div>

        <div class="info-card">
          <p><strong>For your security:</strong> This link will expire in <strong>${expiryText}</strong>.</p>
        </div>

        <div class="warning-box">
          <p class="warning-text">
            If you did not request this password reset, you can ignore this email. Your current password will remain unchanged.
          </p>
        </div>

        <p class="paragraph" style="font-size: 14px; color: #64748b; margin-bottom: 0;">
          If the button doesn’t work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" class="link-text" target="_blank">${resetUrl}</a>
        </p>
      </div>

      <div class="footer">
        <p>This is an automated email from CampusCore. Please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} CampusCore. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};
