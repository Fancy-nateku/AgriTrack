import { Router, Response } from 'express';
import { ObjectId } from 'mongodb';
import { dbConnection, COLLECTIONS } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Expense, expenseToClient } from '../types';
import { validate, schemas } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// Get expenses for a farm
router.get('/', validate(schemas.farmIdQuery), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farm_id } = req.query;

    if (!farm_id) {
      res.status(400).json({ error: 'farm_id is required' });
      return;
    }

    const db = dbConnection.getDb();
    const expensesCollection = db.collection<Expense>(COLLECTIONS.EXPENSES);

    const expenses = await expensesCollection
      .find({ farm_id: new ObjectId(farm_id as string) })
      .sort({ date: -1 })
      .toArray();

    res.json({ expenses: expenses.map(expenseToClient) });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Create expense
router.post('/', validate(schemas.createExpense), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farm_id, category, description, amount, date } = req.body;

    if (!farm_id || !category || !description || !amount || !date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = dbConnection.getDb();
    const expensesCollection = db.collection<Expense>(COLLECTIONS.EXPENSES);

    const now = new Date();
    const newExpense: Expense = {
      farm_id: new ObjectId(farm_id),
      category,
      description,
      amount: parseFloat(amount),
      date: new Date(date),
      created_at: now,
      updated_at: now,
    };

    const result = await expensesCollection.insertOne(newExpense);
    const expense = { ...newExpense, _id: result.insertedId };

    res.status(201).json({ expense: expenseToClient(expense) });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense
router.put('/:id', validate(schemas.updateExpense), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expenseId = req.params.id;
    const { category, description, amount, date } = req.body;

    const db = dbConnection.getDb();
    const expensesCollection = db.collection<Expense>(COLLECTIONS.EXPENSES);

    const result = await expensesCollection.updateOne(
      { _id: new ObjectId(expenseId) },
      {
        $set: {
          ...(category && { category }),
          ...(description && { description }),
          ...(amount && { amount: parseFloat(amount) }),
          ...(date && { date: new Date(date) }),
          updated_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', validate(schemas.idParam), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expenseId = req.params.id;

    const db = dbConnection.getDb();
    const expensesCollection = db.collection<Expense>(COLLECTIONS.EXPENSES);

    const result = await expensesCollection.deleteOne({
      _id: new ObjectId(expenseId),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
