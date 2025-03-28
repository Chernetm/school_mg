import nodemailer from "nodemailer";

// Create reusable transporter object using default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or another SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send the email
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,  // Sender address
      to,                           // Receiver address
      subject,                      // Subject line
      html: htmlContent,            // HTML body content
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};
