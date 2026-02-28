import dotenv from 'dotenv';
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',

  db: {
    url: process.env.DATABASE_URL || '',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || 'webdev.muhammad@gmail.com',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'ShopifyPro <webdev.muhammad@gmail.com>',
  },

  frontendUrl: process.env.PRIMARY_FRONTEND_URL || 'https://muhammad-shopify-expert.vercel.app',

  cors: {
    origin: (process.env.FRONTEND_URL || 'http://localhost:5173,https://muhammad-shopify-expert.vercel.app').split(',').map((u) => u.trim()),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  payment: {
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    nayapay: {
      accountTitle: process.env.NAYAPAY_ACCOUNT_TITLE || '',
      accountNumber: process.env.NAYAPAY_ACCOUNT_NUMBER || '',
    },
    sadapay: {
      accountTitle: process.env.SADAPAY_ACCOUNT_TITLE || '',
      accountNumber: process.env.SADAPAY_ACCOUNT_NUMBER || '',
    },
    payoneer: {
      email: process.env.PAYONEER_EMAIL || '',
    },
  },
} as const;
