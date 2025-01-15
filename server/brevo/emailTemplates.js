const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f9;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4CAF50;
      padding: 20px;
      color: #ffffff;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .verification-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 3px;
      color: #4CAF50;
      background-color: #e8f5e9;
      padding: 15px 30px;
      border-radius: 4px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      color: #777;
      margin-top: 30px;
    }
    a {
      text-decoration: none;
      color: #4CAF50;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up! Your verification code is:</p>
      <div class="verification-code">{verificationCode}</div>
      <p>Enter this code on the verification page to complete your registration.</p>
      <p>This code will expire in one hour for security reasons.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>

`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f9;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4CAF50;
      padding: 20px;
      color: #ffffff;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    .success-icon {
      font-size: 50px;
      color: #4CAF50;
      background-color: #e8f5e9;
      width: 60px;
      height: 60px;
      line-height: 60px;
      border-radius: 50%;
      margin: 20px auto;
    }
    ul {
      text-align: left;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      color: #777;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Successful</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your password has been successfully reset.</p>
      <div class="success-icon">✓</div>
      <p>If you did not initiate this password reset, please contact our support team immediately.</p>
      <p>For security reasons, we recommend that you:</p>
      <ul>
        <li>Use a strong, unique password</li>
        <li>Avoid using the same password across multiple sites</li>
      </ul>
      <p>Thank you for helping us keep your account secure.</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>

`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f9;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4CAF50;
      padding: 20px;
      color: #ffffff;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    a.reset-button {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      background-color: #4CAF50;
      padding: 12px 20px;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      color: #777;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. If you made this request, please click the link below to reset your password:</p>
      <a href="{resetLink}" class="reset-button">Reset Your Password</a>
      <p>This link will expire in 1 hour. If you didn't make this request, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>

`

const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Monster</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #4CAF50;
      padding: 20px;
      color: #ffffff;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      text-align: center;
    }
    h1 {
      color: #333;
      font-size: 24px;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      color: #777;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome, {name}!</h1>
    </div>
    <div class="content">
      <p>Thank you for joining us! We're excited to have you on board.</p>
    </div>
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`
const NOTIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Email</title>
  <style>
    * {
      
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 0 10px 2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      padding: 20px;

    }
    .header {
      
      text-align: center;
      margin-bottom: 20px;

    }
    .content {
      font-size: 16px;
      line-height: 1.5;
      color: #333;
    }
    .footer {
      font-size: 12px;
      text-align: center;
      color: #777;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order placed successfully!</h1>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>Thank you for your order! We're excited to have you on board.</p>
    </div>
    <div class="footer">
      <p>Best regards,</p>
      <p>Team Ebee</p>
    </div>
  </div>
</body>
</html>
`

module.exports = {
  NOTIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
}