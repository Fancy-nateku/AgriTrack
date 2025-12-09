import { Router, Response } from 'express';
import { ObjectId } from 'mongodb';
import { dbConnection, COLLECTIONS } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Expense, Income, Activity } from '../types';

const router = Router();
router.use(authMiddleware);

// Get dashboard metrics
router.get('/metrics', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farm_id } = req.query;

    if (!farm_id) {
      res.status(400).json({ error: 'farm_id is required' });
      return;
    }

    const db = dbConnection.getDb();
    const farmObjectId = new ObjectId(farm_id as string);

    // Get expenses
    const expensesCollection = db.collection<Expense>(COLLECTIONS.EXPENSES);
    const expenses = await expensesCollection
      .find({ farm_id: farmObjectId })
      .toArray();

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Get income
    const incomeCollection = db.collection<Income>(COLLECTIONS.INCOME);
    const income = await incomeCollection
      .find({ farm_id: farmObjectId })
      .toArray();

    const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

    // Get activities
    const activitiesCollection = db.collection<Activity>(COLLECTIONS.ACTIVITIES);
    const activities = await activitiesCollection
      .find({ farm_id: farmObjectId })
      .toArray();

    const activeActivities = activities.filter(a => !a.completed).length;
    const completedActivities = activities.filter(a => a.completed).length;

    // Calculate net profit
    const netProfit = totalIncome - totalExpenses;

    res.json({
      metrics: {
        totalExpenses,
        totalIncome,
        netProfit,
        expenseCount: expenses.length,
        incomeCount: income.length,
        activeActivities,
        completedActivities,
        totalActivities: activities.length,
      },
    });
  } catch (error) {
    console.error('Get dashboard metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

export default router;
