import { createServer } from 'http';
import app from './app';
import { config } from './config';
import prisma from './config/database';
import cron from 'node-cron';
import { checkDeadlineReminders } from './jobs/deadline-reminder';
import { checkUnreadMessages } from './jobs/unread-message-reminder';
import { initializeSocket } from './socket';

const httpServer = createServer(app);

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Initialize Socket.IO
    initializeSocket(httpServer);
    console.log('Socket.IO initialized');

    // Cron jobs
    cron.schedule('*/30 * * * *', () => {
      console.log('[Cron] Running deadline reminder check...');
      checkDeadlineReminders();
    });
    console.log('Deadline reminder cron job scheduled (every 30 minutes)');

    cron.schedule('*/5 * * * *', () => {
      console.log('[Cron] Running unread message check...');
      checkUnreadMessages();
    });
    console.log('Unread message reminder cron job scheduled (every 5 minutes)');

    httpServer.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`API available at http://localhost:${config.port}${config.apiPrefix}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const shutdown = async (): Promise<void> => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
