import nodemailer from 'nodemailer';
import { config } from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendVerificationEmail = async (to: string, token: string, firstName: string) => {
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: config.email.from,
    to,
    subject: 'Verify Your Email - ShopifyPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A1B; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #6C63FF, #00D9FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ShopifyPro</span>
          </h1>
        </div>
        <h2 style="font-size: 22px; margin-bottom: 16px;">Welcome, ${firstName}!</h2>
        <p style="color: #B0B0C0; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thanks for creating an account with ShopifyPro. Please verify your email address by clicking the button below.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #6C63FF, #00D9FF); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #B0B0C0; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${verifyUrl}" style="color: #6C63FF; word-break: break-all;">${verifyUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #2A2A4A; margin: 32px 0;" />
        <p style="color: #666; font-size: 12px; text-align: center;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  await transporter.sendMail({
    from: config.email.from,
    to: 'webdev.muhammad@gmail.com',
    replyTo: data.email,
    subject: `New Contact Form Message from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A1B; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #6C63FF, #00D9FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ShopifyPro</span>
          </h1>
          <p style="color: #B0B0C0; margin-top: 8px;">New Contact Form Submission</p>
        </div>
        <div style="background: #1E1E3F; border: 1px solid #2A2A4A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Name:</strong> ${data.name}</p>
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Email:</strong> <a href="mailto:${data.email}" style="color: #00D9FF;">${data.email}</a></p>
          <p style="margin: 0;"><strong style="color: #6C63FF;">Message:</strong></p>
          <p style="color: #B0B0C0; line-height: 1.6; margin: 8px 0 0; white-space: pre-wrap;">${data.message}</p>
        </div>
        <p style="color: #666; font-size: 12px; text-align: center;">
          You can reply directly to this email to respond to ${data.name}.
        </p>
      </div>
    `,
  });
};
