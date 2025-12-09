import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { dbConnection, COLLECTIONS } from '../config/database';
import { User, Profile, userToClient } from '../types';
import { validate, schemas } from '../middleware/validation';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Register new user
router.post('/register', validate(schemas.register), async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, full_name } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const db = dbConnection.getDb();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const now = new Date();
    const newUser: User = {
      username,
      email: `${username}@agritrack.local`,
      password: hashedPassword,
      created_at: now,
      updated_at: now,
    };

    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId;

    // Create profile
    const profilesCollection = db.collection<Profile>(COLLECTIONS.PROFILES);
    await profilesCollection.insertOne({
      user_id: userId,
      username,
      full_name,
      created_at: now,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId.toString(), username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    res.status(201).json({
      user: userToClient({ ...newUser, _id: userId }),
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', validate(schemas.login), async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const db = dbConnection.getDb();
    const usersCollection = db.collection<User>(COLLECTIONS.USERS);

    // Find user
    const user = await usersCollection.findOne({ username });
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id!.toString(), username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    res.json({
      user: userToClient(user),
      token,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        username: string;
      };

      const db = dbConnection.getDb();
      const usersCollection = db.collection<User>(COLLECTIONS.USERS);

      const user = await usersCollection.findOne({
        _id: new ObjectId(decoded.userId),
      });

      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      res.json({ user: userToClient(user) });
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;
