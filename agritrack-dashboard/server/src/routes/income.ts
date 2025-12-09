import { Router, Response } from 'express';
import { ObjectId } from 'mongodb';
import { dbConnection, COLLECTIONS } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Income, incomeToClient } from '../types';
import { validate, schemas } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// Get income for a farm
router.get('/', validate(schemas.farmIdQuery), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farm_id } = req.query;

    if (!farm_id) {
      res.status(400).json({ error: 'farm_id is required' });
      return;
    }

    const db = dbConnection.getDb();
    const incomeCollection = db.collection<Income>(COLLECTIONS.INCOME);

    const income = await incomeCollection
      .find({ farm_id: new ObjectId(farm_id as string) })
      .sort({ date: -1 })
      .toArray();

    res.json({ income: income.map(incomeToClient) });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ error: 'Failed to fetch income' });
  }
});

// Create income
router.post('/', validate(schemas.createIncome), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farm_id, source, description, amount, date } = req.body;

    if (!farm_id || !source || !amount || !date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = dbConnection.getDb();
    const incomeCollection = db.collection<Income>(COLLECTIONS.INCOME);

    const now = new Date();
    const newIncome: Income = {
      farm_id: new ObjectId(farm_id),
      source,
      description,
      amount: parseFloat(amount),
      date: new Date(date),
      created_at: now,
      updated_at: now,
    };

    const result = await incomeCollection.insertOne(newIncome);
    const income = { ...newIncome, _id: result.insertedId };

    res.status(201).json({ income: incomeToClient(income) });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({ error: 'Failed to create income' });
  }
});

// Update income
router.put('/:id', validate(schemas.updateIncome), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incomeId = req.params.id;
    const { source, description, amount, date } = req.body;

    const db = dbConnection.getDb();
    const incomeCollection = db.collection<Income>(COLLECTIONS.INCOME);

    const result = await incomeCollection.updateOne(
      { _id: new ObjectId(incomeId) },
      {
        $set: {
          ...(source && { source }),
          ...(description !== undefined && { description }),
          ...(amount && { amount: parseFloat(amount) }),
          ...(date && { date: new Date(date) }),
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Income not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update income error:', error);
    res.status(500).json({ error: 'Failed to update income' });
  }
});

// Delete income
router.delete('/:id', validate(schemas.idParam), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const incomeId = req.params.id;

    const db = dbConnection.getDb();
    const incomeCollection = db.collection<Income>(COLLECTIONS.INCOME);

    const result = await incomeCollection.deleteOne({
      _id: new ObjectId(incomeId),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Income not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({ error: 'Failed to delete income' });
  }
});

export default router;
