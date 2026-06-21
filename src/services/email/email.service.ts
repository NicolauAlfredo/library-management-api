import nodemailer from "nodemailer";

interface SendPasswordResetEmailData {
  to: string;
  resetUrl: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendPasswordResetEmail({
    to,
    resetUrl,
  }: SendPasswordResetEmailData): Promise<void> {
    await this.transporter.sendMail({
      from: `"Librara" <${process.env.SMTP_FROM}>`,
      to,
      subject: "Reset your Librara password",
      html: `
        <h1>Password reset</h1>
        <p>You requested to reset your Librara password.</p>
        <p>Click the link below to create a new password:</p>
        <a href="${resetUrl}">Reset password</a>
        <p>This link expires in 30 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
  }
}
