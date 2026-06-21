import { Resend } from "resend";

interface SendPasswordResetEmailData {
  to: string;
  resetUrl: string;
}

export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordResetEmail({
    to,
    resetUrl,
  }: SendPasswordResetEmailData): Promise<void> {
    await this.resend.emails.send({
      from: `Librara <${process.env.SMTP_FROM}>`,
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
