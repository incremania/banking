

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.fundsapplicantsclaims.com", 
  port: 465, 
  secure: true, 
  auth: {
    user: "support@fundsapplicantsclaims.com",
    pass: "@samorah5419", 
  },
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    // Setup email data
    const mailOptions = {
      from: "support@fundsapplicantsclaims.com",
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    // Send email with defined transport object
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;


