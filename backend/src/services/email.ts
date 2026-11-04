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