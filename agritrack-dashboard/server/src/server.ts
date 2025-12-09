// Load environment variables FIRST before any imports
import dotenv from 'dotenv';

// Load .env file
const result = dotenv.config();
if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
  console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('🔍 MONGODB_URI value:', process.env.MONGODB_URI?.substring(0, 30) + '...');
}


import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { dbConnection } from './config/database';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import farmsRoutes from './routes/farms';
import expensesRoutes from './routes/expenses';
import incomeRoutes from './routes/income';
import activitiesRoutes from './routes/activities';
import dashboardRoutes from './routes/dashboard';


const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security middleware
app.use(helmet());

// Request logging (Morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Colored, concise output for development
} else {
  app.use(morgan('combined')); // Apache-style logging for production
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AgriTrack API Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await dbConnection.connect();

    app.listen(PORT, () => {
      console.log(`🚀 AgriTrack API Server running on http://localhost:${PORT}`);
      console.log(`📡 Accepting requests from: ${FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await dbConnection.disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start the server
startServer();
