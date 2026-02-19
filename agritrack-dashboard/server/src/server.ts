// Load environment variables FIRST before any imports
import dotenv from 'dotenv';

// Load .env file (optional in production - Render/Railway set env vars directly)
const result = dotenv.config();
if (result.error) {
  // Only show error in development (production uses platform env vars)
  if (process.env.NODE_ENV !== 'production') {
    console.error('❌ Error loading .env file:', result.error);
  }
} else {
  console.log('✅ .env file loaded successfully');
}

// Verify MongoDB URI is available (from .env or platform)
console.log('🔍 MONGODB_URI exists:', !!process.env.MONGODB_URI);


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

// CORS configuration - allow multiple frontend origins
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
