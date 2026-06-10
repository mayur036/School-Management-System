export const welcomeEmailTemplate = ({
  name,
  email,
  password,
  roleName,
  loginUrl,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CampusCore</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 32px 0;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: #0f172a;
      padding: 28px 40px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      text-decoration: none;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
    }
    .eyebrow {
      font-size: 13px;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 12px 0;
    }
    .headline {
      font-size: 28px;
      line-height: 1.2;
      color: #111827;
      margin: 0 0 16px 0;
      font-weight: 700;
    }
    .paragraph {
      font-size: 16px;
      line-height: 1.7;
      color: #4b5563;
      margin: 0 0 16px 0;
    }
    .card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 24px;
      margin: 28px 0;
    }
    .card-title {
      margin: 0 0 16px 0;
      font-size: 15px;
      font-weight: 700;
      color: #111827;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 15px;
    }
    .detail-row:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }
    .detail-label {
      color: #6b7280;
    }
    .detail-value {
      color: #111827;
      font-weight: 600;
      word-break: break-all;
    }
    .notice {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 4px solid #2563eb;
      border-radius: 10px;
      padding: 16px 18px;
      margin: 24px 0;
    }
    .notice p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #1e3a8a;
    }
    .button-wrap {
      text-align: center;
      margin: 32px 0 8px;
    }
    .button {
      display: inline-block;
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 8px;
    }
    .footer {
      padding: 24px 40px 32px;
      text-align: center;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 13px;
      line-height: 1.6;
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
      .detail-row {
        display: block;
      }
      .detail-value {
        display: block;
        margin-top: 4px;
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
        <p class="eyebrow">Welcome aboard</p>
        <h1 class="headline">Your CampusCore account is ready</h1>

        <p class="paragraph">Hello ${name},</p>
        <p class="paragraph">
          Welcome to CampusCore. Your account has been successfully created, and you can now access the platform as a <strong>${roleName}</strong>.
        </p>
        <p class="paragraph">
          Below are your temporary login details. Please use them to sign in for the first time.
        </p>

        <div class="card">
          <p class="card-title">Login Details</p>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">${email}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Temporary Password</span>
            <span class="detail-value">${password}</span>
          </div>
        </div>

        <div class="notice">
          <p><strong>Security note:</strong> Please change your password immediately after your first login to keep your account secure.</p>
        </div>

        <div class="button-wrap">
          <a href="${loginUrl}" class="button" target="_blank">Sign In to CampusCore</a>
        </div>

        <p class="paragraph" style="margin-top: 28px;">
          If you need any assistance, please contact your administrator or support team.
        </p>
      </div>

      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; ${new Date().getFullYear()} CampusCore. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};
