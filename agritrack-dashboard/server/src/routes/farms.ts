import { Router, Response } from 'express';
import { ObjectId } from 'mongodb';
import { dbConnection, COLLECTIONS } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Farm, farmToClient } from '../types';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get user's farms
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const db = dbConnection.getDb();
    const farmsCollection = db.collection<Farm>(COLLECTIONS.FARMS);

    const farms = await farmsCollection
      .find({ owner_id: new ObjectId(userId) })
      .toArray();

    res.json({ farms: farms.map(farmToClient) });
  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({ error: 'Failed to fetch farms' });
  }
});

// Get default farm (or create if doesn't exist)
router.get('/default', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const db = dbConnection.getDb();
    const farmsCollection = db.collection<Farm>(COLLECTIONS.FARMS);

    let farm = await farmsCollection.findOne({
      owner_id: new ObjectId(userId),
    });

    if (!farm) {
      // Create default farm
      const now = new Date();
      const newFarm: Farm = {
        owner_id: new ObjectId(userId),
        name: 'My Farm',
        location: '',
        size_acres: 0,
        created_at: now,
        updated_at: now,
      };

      const result = await farmsCollection.insertOne(newFarm);
      farm = { ...newFarm, _id: result.insertedId };
    }

    res.json({ farm: farmToClient(farm) });
  } catch (error) {
    console.error('Get default farm error:', error);
    res.status(500).json({ error: 'Failed to get farm' });
  }
});

// Create farm
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { name, location, size_acres } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Farm name is required' });
      return;
    }

    const db = dbConnection.getDb();
    const farmsCollection = db.collection<Farm>(COLLECTIONS.FARMS);

    const now = new Date();
    const newFarm: Farm = {
      owner_id: new ObjectId(userId),
      name,
      location: location || '',
      size_acres: size_acres || 0,
      created_at: now,
      updated_at: now,
    };

    const result = await farmsCollection.insertOne(newFarm);
    const farm = { ...newFarm, _id: result.insertedId };

    res.status(201).json({ farm: farmToClient(farm) });
  } catch (error) {
    console.error('Create farm error:', error);
    res.status(500).json({ error: 'Failed to create farm' });
  }
});

// Update farm
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const farmId = req.params.id;
    const { name, location, size_acres } = req.body;

    const db = dbConnection.getDb();
    const farmsCollection = db.collection<Farm>(COLLECTIONS.FARMS);

    // Verify ownership
    const farm = await farmsCollection.findOne({
      _id: new ObjectId(farmId),
      owner_id: new ObjectId(userId),
    });

    if (!farm) {
      res.status(404).json({ error: 'Farm not found' });
      return;
    }

    const result = await farmsCollection.updateOne(
      { _id: new ObjectId(farmId) },
      {
        $set: {
          ...(name && { name }),
          ...(location !== undefined && { location }),
          ...(size_acres !== undefined && { size_acres }),
          updated_at: new Date(),
        },
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({ error: 'Failed to update farm' });
  }
});

// Delete farm
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const farmId = req.params.id;

    const db = dbConnection.getDb();
    const farmsCollection = db.collection<Farm>(COLLECTIONS.FARMS);

    const result = await farmsCollection.deleteOne({
      _id: new ObjectId(farmId),
      owner_id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Farm not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({ error: 'Failed to delete farm' });
  }
});

export default router;
