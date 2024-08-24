import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

export default async function sendEmail(
  to: string,
  body: string
): Promise<SMTPTransport.SentMessageInfo> {
  // generate test ethereal email account - executed once and info stored in .env file
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("Test Email Account: ", testAccount);

  const emailAccountUser = process.env.EMAIL_USER;
  const emailAccountPass = process.env.EMAIL_PASS;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: emailAccountUser,
      pass: emailAccountPass,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Jeddit👻"${emailAccountUser}`,
    to: to,
    subject: "Reset Password",
    html: body,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview Email: ", nodemailer.getTestMessageUrl(info));

  return info;
}
