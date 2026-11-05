import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@parkbuddy.co.za',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Email error:', error);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
  const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;
  
  await sendEmail(email, 'Verify your ParkBuddy SA account', `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🅿️ ParkBuddy SA</h1>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
        <p style="color: #4b5563; line-height: 1.6;">Welcome to ParkBuddy SA! Please click the button below to verify your email address and activate your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">Or copy this link to your browser: ${verifyUrl}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">This link expires in 24 hours. If you didn't create an account, please ignore this email.</p>
      </div>
    </div>
  `);
};

export const sendPasswordResetEmail = async (email: string, fullName: string, resetUrl: string) => {
  await sendEmail(email, 'Reset your ParkBuddy SA password', `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">🅿️ ParkBuddy SA</h1>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #4b5563; line-height: 1.6;">Hi ${fullName},</p>
        <p style="color: #4b5563; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">Or copy this link to your browser: ${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">This link expires in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you're concerned.</p>
      </div>
    </div>
  `);
};