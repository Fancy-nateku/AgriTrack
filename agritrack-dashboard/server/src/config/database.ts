import { MongoClient, Db } from 'mongodb';

class DatabaseConnection {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    try {
      // Read environment variables here, AFTER dotenv has loaded them
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
      const DB_NAME = process.env.MONGODB_DB_NAME || 'agritrack';

      console.log('🔍 MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
      console.log('🔍 DB Name:', DB_NAME);

      // Create MongoClient with Stable API version (recommended by MongoDB Atlas)
      this.client = new MongoClient(MONGODB_URI, {
        serverApi: {
          version: '1',
          strict: true,
          deprecationErrors: true,
        },
        retryWrites: true,
        // TLS/SSL options for Atlas connections
        tls: true,
        tlsAllowInvalidCertificates: false, // Set to true only for debugging
      });
      
      await this.client.connect();
      
      // Send a ping to confirm successful connection
      await this.client.db('admin').command({ ping: 1 });
      
      this.db = this.client.db(DB_NAME);
      console.log('✅ Connected to MongoDB');
      console.log('✅ Successfully pinged MongoDB deployment');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}

export const dbConnection = new DatabaseConnection();

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  FARMS: 'farms',
  EXPENSES: 'expenses',
  INCOME: 'income',
  ACTIVITIES: 'activities',
  CROPS: 'crops',
  INVENTORY: 'inventory',
  WORKERS: 'workers',
  LABOR_RECORDS: 'labor_records',
  FARM_NOTES: 'farm_notes',
} as const;
