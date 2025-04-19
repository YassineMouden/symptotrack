import { Resend } from 'resend';
import { env } from "~/env";

// Initialize the Resend client with your API key
// You'll need to add RESEND_API_KEY to your .env file
const resend = new Resend(env.RESEND_API_KEY);

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = "SymptoTrack <noreply@symptotrack.com>" }: SendEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Password reset email template
export function getPasswordResetEmailHtml(userName: string, resetLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your SymptoTrack Password</title>
        <style>
          body { font-family: sans-serif; line-height: 1.5; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #14b8a6; padding: 20px; text-align: center; color: white; }
          .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
          .button { display: inline-block; padding: 12px 24px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 4px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hello ${userName || 'there'},</p>
            <p>We received a request to reset your password for your SymptoTrack account. Please click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>Best regards,<br>The SymptoTrack Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Welcome email template
export function getWelcomeEmailHtml(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to SymptoTrack</title>
        <style>
          body { font-family: sans-serif; line-height: 1.5; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #14b8a6; padding: 20px; text-align: center; color: white; }
          .content { padding: 20px; border: 1px solid #ddd; border-top: none; }
          .button { display: inline-block; padding: 12px 24px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 4px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to SymptoTrack!</h1>
          </div>
          <div class="content">
            <p>Hello ${userName || 'there'},</p>
            <p>Thank you for creating a SymptoTrack account. We're excited to help you track your symptoms and understand your health better.</p>
            <p>With SymptoTrack, you can:</p>
            <ul>
              <li>Record your symptoms with detailed information</li>
              <li>Track changes in your health over time</li>
              <li>Receive insights about potential conditions</li>
              <li>Share information with your healthcare providers</li>
            </ul>
            <p style="text-align: center;">
              <a href="https://symptotrack.com/symptoms" class="button">Start Tracking Now</a>
            </p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p>Best regards,<br>The SymptoTrack Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
} 