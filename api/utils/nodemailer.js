const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const messages = require('./messages');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (email, otp) => {
  const subject = `Your otp ${messages.VERIFICATION}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Email Verification</h2>
      <p>Your OTP code is:</p>
      <h3 style="color: blue;">${otp}</h3>
      <p>This code is valid for <strong>1 minute</strong>.</p>
      <br />
      <p>Thank you,</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
