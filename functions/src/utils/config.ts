import dotenv from 'dotenv';
dotenv.config();

interface Config {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    toEmail: string;
    fonts: {
        Roboto: {
            normal: string;
            bold: string;
            italics: string;
            bolditalics: string;
        };
    };
}

const config: Config = {
    smtpHost: process.env.SMTP_HOST || "smtp.eu.mailgun.org",
    smtpPort: parseInt(process.env.SMTP_PORT || "465"),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    fromEmail: process.env.FROM_EMAIL || 'mail@eachmoment.net',
    toEmail: process.env.TO_EMAIL || 'hallo@eachmoment.de',
    fonts: {
        Roboto: {
            normal: 'fonts/Roboto/Roboto-Regular.ttf',
            bold: 'fonts/Roboto/Roboto-Bold.ttf',
            italics: 'fonts/Roboto/Roboto-RegularItalic.ttf',
            bolditalics: 'fonts/Roboto/Roboto-BoldItalic.ttf'
        }
    }
};

export default config;
