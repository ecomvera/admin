import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
};

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// transporter
//   .verify()
//   .then(() => {
//     console.log("Server is ready to send emails");
//   })
//   .catch((err) => {
//     console.log("Server is not ready to send emails", err);
//   });

export const sendEmail = async (payload: EmailPayload) => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      ...payload,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};
