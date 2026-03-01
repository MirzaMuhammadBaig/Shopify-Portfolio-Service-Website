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

export const sendPasswordResetEmail = async (to: string, token: string, firstName: string) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: config.email.from,
    to,
    subject: 'Reset Your Password - ShopifyPro',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A1B; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #6C63FF, #00D9FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ShopifyPro</span>
          </h1>
        </div>
        <h2 style="font-size: 22px; margin-bottom: 16px;">Hi ${firstName},</h2>
        <p style="color: #B0B0C0; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #6C63FF, #00D9FF); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="color: #B0B0C0; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #6C63FF; word-break: break-all;">${resetUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #2A2A4A; margin: 32px 0;" />
        <p style="color: #666; font-size: 12px; text-align: center;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      </div>
    `,
  });
};

export const sendPaymentNotificationEmail = async (data: {
  orderNumber: string;
  serviceTitle: string;
  amount: number;
  method: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  screenshotBuffer?: Buffer;
  screenshotFilename?: string;
}) => {
  const attachments: any[] = [];
  if (data.screenshotBuffer) {
    attachments.push({
      filename: data.screenshotFilename || 'transaction-screenshot.png',
      content: data.screenshotBuffer,
    });
  }

  await transporter.sendMail({
    from: config.email.from,
    to: 'webdev.muhammad@gmail.com',
    subject: `New Payment Received - Order #${data.orderNumber}`,
    attachments,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A1B; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #6C63FF, #00D9FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ShopifyPro</span>
          </h1>
          <p style="color: #B0B0C0; margin-top: 8px;">New Payment Submission</p>
        </div>
        <div style="background: #1E1E3F; border: 1px solid #2A2A4A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Order #:</strong> ${data.orderNumber}</p>
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Service:</strong> ${data.serviceTitle}</p>
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Amount:</strong> $${data.amount.toFixed(2)}</p>
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Method:</strong> ${data.method}</p>
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Transaction ID:</strong> <span style="color: #00D9FF;">${data.transactionId}</span></p>
          <hr style="border: none; border-top: 1px solid #2A2A4A; margin: 16px 0;" />
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Customer:</strong> ${data.customerName}</p>
          <p style="margin: 0;"><strong style="color: #6C63FF;">Email:</strong> <a href="mailto:${data.customerEmail}" style="color: #00D9FF;">${data.customerEmail}</a></p>
        </div>
        ${data.screenshotBuffer ? '<p style="color: #B0B0C0; font-size: 14px; text-align: center;">Transaction screenshot attached to this email.</p>' : ''}
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 24px;">
          Please verify this payment in the admin panel.
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

export const sendOrderStatusEmail = async (data: {
  to: string;
  recipientName: string;
  orderNumber: string;
  serviceTitle: string;
  statusLabel: string;
  customerName: string;
  customerEmail: string;
  isAdmin: boolean;
}) => {
  const subject = data.isAdmin
    ? `Order #${data.orderNumber} Status Changed to ${data.statusLabel}`
    : `Your Order #${data.orderNumber} Has Been Updated`;

  const heading = data.isAdmin ? 'Order Status Update' : `Hi ${data.recipientName},`;

  const mainMessage = data.isAdmin
    ? `Order #${data.orderNumber} status has been changed.`
    : `Your order status has been updated to <strong style="color: #00D9FF;">${data.statusLabel}</strong>.`;

  await transporter.sendMail({
    from: config.email.from,
    to: data.to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A1B; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #6C63FF, #00D9FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ShopifyPro</span>
          </h1>
          <p style="color: #B0B0C0; margin-top: 8px;">Order Status Update</p>
        </div>
        <h2 style="font-size: 22px; margin-bottom: 16px;">${heading}</h2>
        <p style="color: #B0B0C0; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${mainMessage}</p>
        <div style="background: #1E1E3F; border: 1px solid #2A2A4A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Order #:</strong> ${data.orderNumber}</p>
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Service:</strong> ${data.serviceTitle}</p>
          <p style="margin: 0;"><strong style="color: #6C63FF;">New Status:</strong> <span style="color: #00D9FF;">${data.statusLabel}</span></p>
          ${data.isAdmin ? `
            <hr style="border: none; border-top: 1px solid #2A2A4A; margin: 16px 0;" />
            <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Customer:</strong> ${data.customerName}</p>
            <p style="margin: 0;"><strong style="color: #6C63FF;">Email:</strong> <a href="mailto:${data.customerEmail}" style="color: #00D9FF;">${data.customerEmail}</a></p>
          ` : ''}
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 24px;">
          ${data.isAdmin ? 'This is an automated notification from ShopifyPro.' : 'If you have questions, please contact us through the chat feature on our website.'}
        </p>
      </div>
    `,
  });
};

export const sendReviewNotificationEmail = async (data: {
  to: string;
  recipientName: string;
  serviceName: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
  isAdmin: boolean;
}) => {
  const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);

  const subject = data.isAdmin
    ? `New Review Received — ${data.serviceName} (${data.rating}/5)`
    : `Thank You for Your Review — ${data.serviceName}`;

  const heading = data.isAdmin
    ? 'New Review Submitted'
    : `Thank You, ${data.recipientName}!`;

  const mainMessage = data.isAdmin
    ? `<strong>${data.reviewerName}</strong> left a new review for <strong style="color: #00D9FF;">${data.serviceName}</strong>.`
    : `Your feedback for <strong style="color: #00D9FF;">${data.serviceName}</strong> has been submitted successfully. We truly appreciate you taking the time to share your experience — it means a lot to us and helps us improve our services.`;

  await transporter.sendMail({
    from: config.email.from,
    to: data.to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A1B; color: #ffffff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 28px; margin: 0;">
            <span style="background: linear-gradient(135deg, #6C63FF, #00D9FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ShopifyPro</span>
          </h1>
          <p style="color: #B0B0C0; margin-top: 8px;">${data.isAdmin ? 'Review Notification' : 'Review Confirmation'}</p>
        </div>
        <h2 style="font-size: 22px; margin-bottom: 16px;">${heading}</h2>
        <p style="color: #B0B0C0; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${mainMessage}</p>
        <div style="background: #1E1E3F; border: 1px solid #2A2A4A; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Service:</strong> ${data.serviceName}</p>
          <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Rating:</strong> <span style="color: #FFB300; font-size: 18px;">${stars}</span> (${data.rating}/5)</p>
          ${data.comment ? `<p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Comment:</strong></p><p style="color: #B0B0C0; line-height: 1.6; margin: 4px 0 0; white-space: pre-wrap;">${data.comment}</p>` : ''}
          ${data.isAdmin ? `
            <hr style="border: none; border-top: 1px solid #2A2A4A; margin: 16px 0;" />
            <p style="margin: 0 0 12px;"><strong style="color: #6C63FF;">Reviewer:</strong> ${data.reviewerName}</p>
            <p style="margin: 0;"><strong style="color: #6C63FF;">Email:</strong> <a href="mailto:${data.reviewerEmail}" style="color: #00D9FF;">${data.reviewerEmail}</a></p>
          ` : ''}
        </div>
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 24px;">
          ${data.isAdmin ? 'You can manage this review from the admin panel.' : 'Your review helps other customers make informed decisions. Thank you for being part of the ShopifyPro community!'}
        </p>
      </div>
    `,
  });
};
