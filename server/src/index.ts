import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Routes
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import applicationRoutes from './routes/application.routes';
import userRoutes from './routes/user.routes';
import scraperRoutes from './routes/scraper.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Scraper Platform API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scraper', scraperRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Unhandled Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 API Health: http://localhost:${PORT}/api/health`);
});

export default app;
