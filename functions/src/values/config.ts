import { MailConfig } from "types";
import { SMTP_USER, SMTP_PASS } from "values";

let mailConfigInstance: MailConfig | null = null;
export const mailConfig = () => {
  if (!mailConfigInstance)
    mailConfigInstance = {
      smtpHost: "smtp.eu.mailgun.org",
      smtpPort: 465,
      smtpUser: SMTP_USER.value(),
      smtpPass: SMTP_PASS.value(),
      fromEmail: "hallo@eachmoment.de",
      toEmail: "hallo@eachmoment.de",
      fonts: {
        Roboto: {
          normal: __dirname + "/../media/Roboto/Roboto-Regular.ttf",
          bold: __dirname + "/../media/Roboto/Roboto-Bold.ttf",
          italics: __dirname + "/../media/Roboto/Roboto-RegularItalic.ttf",
          bolditalics: __dirname + "/../media/Roboto/Roboto-BoldItalic.ttf",
        },
      },
    };
  return mailConfigInstance;
};
