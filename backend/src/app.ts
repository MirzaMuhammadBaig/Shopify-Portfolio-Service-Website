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
import { adminRoutes } from './modules/admin/admin.routes';
import { whatsappRoutes } from './modules/chat/whatsapp.routes';

const app = express();

// ─── GLOBAL MIDDLEWARE ──────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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
app.use(`${api}/admin`, adminRoutes);
app.use(`${api}/whatsapp`, whatsappRoutes);

// ─── ERROR HANDLING ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
