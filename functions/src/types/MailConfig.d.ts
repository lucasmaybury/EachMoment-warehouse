export type MailConfig = {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  toEmail: string;
  fonts: {
    [key: string]: {
      normal: string;
      bold: string;
      italics: string;
      bolditalics: string;
    };
  };
};
