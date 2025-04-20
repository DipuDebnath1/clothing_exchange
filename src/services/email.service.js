const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
   await transport.sendMail(msg);
};

const sendEmailVerification = async (to, otp) => {

  const subject = "User Verification Code";
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
  </head>
  <body style="background-color: #f3f4f6; padding: 2rem; font-family: Arial, sans-serif; color: #333;">
    <div
        style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; 
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); text-align: center;">
        
        <img src="https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/NEXMOTAG.jpeg"
            alt="NEXMO TAG" style="max-width: 10rem; margin-bottom: 1.5rem;">
        
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">
            Welcome to NEXMO TAG
        </h1>
        
        <p style="color: #4b5563; margin-bottom: 1.5rem;">
            Thank you for joining NEXMO TAG! Your account is almost ready.
        </p>
        
        <div
            style="background: linear-gradient(135deg, #3b82f6, #06b6d4); color: #ffffff; padding: 1rem; 
            border-radius: 0.5rem; font-size: 2rem; font-weight: 800; letter-spacing: 0.1rem; margin-bottom: 1.5rem;">
            ${otp}
        </div>
        
        <p style="color: #4b5563; margin-bottom: 1.5rem;">
            Use this code to verify your account.
        </p>
        
        <p style="color: #ff0000; font-size: 0.85rem; margin-top: 1.5rem;">
            This code will expire in <strong>3 minutes.</strong>
        </p>
        
        <a href="#" style="color: #888; font-size: 12px; text-decoration: none;" 
            target="_blank">ᯤ Develop by ᯤ</a>
    </div>
  </body>
  </html>
  `;

  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, otp) => {
  const subject = "Password Reset Email";
  const html = `
      <body style="background-color: #f3f4f6; padding: 2rem; font-family: Arial, sans-serif; color: #333;">
          <div
              style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); text-align: center;">
              <img src="https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/NEXMOTAG.jpeg"
                  alt="NEXMO-TAG" style="max-width: 8rem; margin-bottom: 1.5rem;">
              <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">Password Reset Request
              </h1>
              <p style="color: #4b5563; margin-bottom: 1.5rem;">You requested a password reset for your account. Use the code
                  below to reset your password:</p>
              <div
                  style="background: linear-gradient(135deg, #3d56ad, #0032D3); color: #ffffff; padding: 1rem; border-radius: 0.5rem; font-size: 2rem; font-weight: 800; letter-spacing: 0.1rem; margin-bottom: 1.5rem;">
                  ${otp}
              </div>
              <p style="color: #d6471c; margin-bottom: 1.5rem;">Collect this code to reset your password. This code is valid
                  for
                  3
                  minutes.</p>
              <p style="color: #6b7280; font-size: 0.875rem; margin-top: 1.5rem;">If you did not request a password reset,
                  please ignore this email.</p>
              <a href="#" style="color: #888; font-size: 12px; text-decoration: none;"
                  target="_blank">ᯤ
                  Develop by ᯤ</a>
          </div>
      </body>
`;
  await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendAdminMessage = async (to, title, description) => {

  const subject = title; // Use title as the email subject
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
  </head>
  <body style="background-color: #f3f4f6; padding: 2rem; font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; 
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); text-align: left;">
        
        <h1 style="font-size: 1.5rem; font-weight: 700; color: #1f2937; text-align: center;">
            ${title}
        </h1>

        <p style="color: #4b5563; margin-bottom: 1.5rem;">
            ${description}
        </p>

        <p style="color: #4b5563; font-size: 0.9rem; margin-top: 2rem; text-align: center;">
            If you have any questions, feel free to reply to this email.
        </p>

        <hr style="border: 0; height: 1px; background: #ddd; margin: 1.5rem 0;">

        <p style="color: #888; font-size: 0.85rem; text-align: center;">
            Regards, <br>
            The Admin Team
        </p>

       <p style="color: #888; font-size: 0.75rem; text-align: center; margin-top: 1rem; display:flex; justify-content:center; align-items:center; gap:1rem">
           <span> &copy; ${new Date().getFullYear()} </span> 
             <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="35"
            viewBox="0 0 42 35"
            fill="none"
          >
            <path
              d="M6.9588 13.3429L1 1.06531L32.0618 1L29.9699 5.3102H7.52932L9.43106 9.22857H28.0681L23.2504 19.1551L25.4691 23.7265L36.6894 1H41L25.4691 33L21.0317 23.8571L16.5309 33L8.54358 16.5429H13.1078L16.5943 23.6612L21.5388 13.3429H6.9588Z"
              fill="#3F4F44"
              stroke="#3F4F44"
            />
          </svg>
          <h1 className="text-3xl font-semibold">SoftWev</h1> <span>All rights reserved.</span>
        </p>
    </div>
  </body>
  </html>
  `;

   await sendEmail(to, subject, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
  sendAdminMessage,
};
