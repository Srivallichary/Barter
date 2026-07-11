const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Barter App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log("Full send info:", info);
  console.log("Message accepted by:", info.accepted);
  console.log("Message rejected by:", info.rejected);
};

module.exports = sendEmail;