import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import chatRoutes from './routes/chat';

// Load environment variables from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();
const PORT = Number(process.env.PORT) || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://192.168.68.67:5173', // Allow access from local network
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/v1', (_req, res) => {
  res.json({ message: 'Athen AI API v1', version: '1.0.0' });
});

// Chat routes
app.use('/api/v1/chat', chatRoutes);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      requestId: Math.random().toString(36).substring(7),
    },
  });
});

// Start server - bind to 0.0.0.0 to allow network access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Network access: http://192.168.68.67:${PORT}`);
});

export default app;
