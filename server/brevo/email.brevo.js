const {
  NOTIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} = require("./emailTemplates");
const { transporter, sender } = require("./brevo.config");

const sendVerificationEmail = async (email, verificationCode, name) => {
  const recipient = email;
  try {
    const emailContent = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationCode,
      "{name}",
      name
    );

    const info = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Verify Your Email.",
      html: emailContent,
    });

    console.log("Verification email sent:", info.messageId);
  } catch (error) {
    console.error(`Error sending verification email`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const recipient = email;

  // Manually inject variables into the template if you're not using a templating engine
  // const welcomeContent = `<p>Welcome, ${name}!</p><p>We're glad to have you with us.</p>`;
  const welcomeContent = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Welcome!",
      html: welcomeContent, // Include the actual content or template here
    });

    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

const sendPasswordResetEmail = async (email, resetLink) => {
  const recipient = email;

  try {
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetLink}", resetLink),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = email;

  try {
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    console.error(`Error sending password reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

const sendNotificationEmail = async (
  userEmail,
  userName,
  notificationContent
) => {
  const personalizedTemplate = NOTIFICATION_EMAIL_TEMPLATE.replace(
    "{userName}",
    userName,
    "{notificationContent}",
    notificationContent
  );
  const recipient = userEmail;
  try {
    const response = await transporter.sendMail({
      from: sender, // Sender email
      to: recipient, // Recipient email
      subject: "Order placed successfully.",
      html: personalizedTemplate, // Use the personalized template
      // category: 'Notification',
    });

    console.log("Notification email sent successfully", response);
  } catch (error) {
    console.error("Error sending notification email", error);
    throw new Error(`Error sending notification email: ${error.message}`);
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetSuccessEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendNotificationEmail,
};
