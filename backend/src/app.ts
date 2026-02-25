import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { apiLimiter, notFoundHandler, errorHandler } from './middleware';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/user/user.routes';
import { serviceRoutes } from './modules/service/service.routes';
import { orderRoutes } from './modules/order/order.routes';
import { chatRoutes } from './modules/chat/chat.routes';
import { reviewRoutes } from './modules/review/review.routes';
import { blogRoutes } from './modules/blog/blog.routes';
import { projectRoutes } from './modules/project/project.routes';
import { faqRoutes } from './modules/faq/faq.routes';
import { testimonialRoutes } from './modules/testimonial/testimonial.routes';
import { adminRoutes } from './modules/admin/admin.routes';

const app = express();

// ─── GLOBAL MIDDLEWARE ──────────────────────────────────
const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

// ─── HEALTH CHECK ───────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API ROUTES ─────────────────────────────────────────
const api = config.apiPrefix;

app.use(`${api}/auth`, authRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/services`, serviceRoutes);
app.use(`${api}/orders`, orderRoutes);
app.use(`${api}/chat`, chatRoutes);
app.use(`${api}/reviews`, reviewRoutes);
app.use(`${api}/blogs`, blogRoutes);
app.use(`${api}/projects`, projectRoutes);
app.use(`${api}/faqs`, faqRoutes);
app.use(`${api}/testimonials`, testimonialRoutes);
app.use(`${api}/admin`, adminRoutes);

// ─── ERROR HANDLING ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
