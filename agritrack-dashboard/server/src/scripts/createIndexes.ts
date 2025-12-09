#!/usr/bin/env node

/**
 * Database Indexes Setup Script
 * Creates performance indexes on MongoDB collections
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'agritrack';

async function createIndexes() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Users collection indexes
    console.log('\n📊 Creating indexes for users collection...');
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Users indexes created');

    // Profiles collection indexes
    console.log('\n📊 Creating indexes for profiles collection...');
    await db.collection('profiles').createIndex({ user_id: 1 }, { unique: true });
    await db.collection('profiles').createIndex({ username: 1 });
    console.log('✅ Profiles indexes created');

    // Farms collection indexes
    console.log('\n📊 Creating indexes for farms collection...');
    await db.collection('farms').createIndex({ owner_id: 1 });
    await db.collection('farms').createIndex({ created_at: -1 });
    console.log('✅ Farms indexes created');

    // Expenses collection indexes
    console.log('\n📊 Creating indexes for expenses collection...');
    await db.collection('expenses').createIndex({ farm_id: 1 });
    await db.collection('expenses').createIndex({ date: -1 });
    await db.collection('expenses').createIndex({ farm_id: 1, date: -1 });
    await db.collection('expenses').createIndex({ category: 1 });
    console.log('✅ Expenses indexes created');

    // Income collection indexes
    console.log('\n📊 Creating indexes for income collection...');
    await db.collection('income').createIndex({ farm_id: 1 });
    await db.collection('income').createIndex({ date: -1 });
    await db.collection('income').createIndex({ farm_id: 1, date: -1 });
    await db.collection('income').createIndex({ source: 1 });
    console.log('✅ Income indexes created');

    // Activities collection indexes
    console.log('\n📊 Creating indexes for activities collection...');
    await db.collection('activities').createIndex({ farm_id: 1 });
    await db.collection('activities').createIndex({ completed: 1 });
    await db.collection('activities').createIndex({ farm_id: 1, completed: 1 });
    await db.collection('activities').createIndex({ time_frame: 1 });
    await db.collection('activities').createIndex({ priority: 1 });
    await db.collection('activities').createIndex({ custom_date: 1 });
    console.log('✅ Activities indexes created');

    // List all indexes
    console.log('\n📋 Listing all indexes...');
    const collections = ['users', 'profiles', 'farms', 'expenses', 'income', 'activities'];
    
    for (const collName of collections) {
      const indexes = await db.collection(collName).indexes();
      console.log(`\n${collName}:`);
      indexes.forEach(index => {
        console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
      });
    }

    console.log('\n✅ All indexes created successfully!');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

createIndexes();
