import { log } from "firebase-functions/logger";
import * as nodemailer from "nodemailer";
import { mailConfig } from "values";

export const sendEmail = async (
  recipientEmails: string[],
  filename: string,
  pdfBuffer: Buffer
) => {
  log("Sending emails to:", recipientEmails);
  const config = mailConfig();
  const mailOptions = {
    from: `"EachMoment" <${config.fromEmail}>`,
    to: recipientEmails.join(", "),
    subject: "Angebot für Digitalisierungsprojekt",
    text: "Im Anhang finden Sie Ihr Angebot.",
    attachments: [
      {
        filename: filename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(process.env.EMAIL_PORT) || 0,
    secure: true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  await transporter.sendMail(mailOptions);
  log("Emails sent successfully");
};
