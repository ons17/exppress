const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "onsbenamara170@gmail.com",
    pass: "000",
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "onsbenamara170@gmail.com",
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = { sendEmail };
