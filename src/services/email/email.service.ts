import { Resend } from "resend";

interface SendPasswordResetEmailData {
  to: string;
  resetUrl: string;
}

export class EmailService {
  private getResendClient() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    return new Resend(apiKey);
  }

  async sendPasswordResetEmail({
    to,
    resetUrl,
  }: SendPasswordResetEmailData): Promise<void> {
    const resend = this.getResendClient();

    await resend.emails.send({
      from: `Librara <${process.env.SMTP_FROM ?? "onboarding@resend.dev"}>`,
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
