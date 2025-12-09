import { Router, Response } from 'express';
import { ObjectId } from 'mongodb';
import { dbConnection, COLLECTIONS } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Activity, activityToClient } from '../types';
import { validate, schemas } from '../middleware/validation';

const router = Router();
router.use(authMiddleware);

// Get activities for a farm
router.get('/', validate(schemas.farmIdQuery), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farm_id } = req.query;

    if (!farm_id) {
      res.status(400).json({ error: 'farm_id is required' });
      return;
    }

    const db = dbConnection.getDb();
    const activitiesCollection = db.collection<Activity>(COLLECTIONS.ACTIVITIES);

    const activities = await activitiesCollection
      .find({ farm_id: new ObjectId(farm_id as string) })
      .sort({ created_at: -1 })
      .toArray();

    res.json({ activities: activities.map(activityToClient) });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Create activity
router.post('/', validate(schemas.createActivity), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farm_id, description, time_frame, custom_date, priority, notes } = req.body;

    if (!farm_id || !description || !time_frame || !priority) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const db = dbConnection.getDb();
    const activitiesCollection = db.collection<Activity>(COLLECTIONS.ACTIVITIES);

    const now = new Date();
    const newActivity: Activity = {
      farm_id: new ObjectId(farm_id),
      description,
      time_frame,
      custom_date: custom_date ? new Date(custom_date) : null,
      priority,
      notes: notes || '',
      completed: false,
      created_at: now,
      updated_at: now,
    };

    const result = await activitiesCollection.insertOne(newActivity);
    const activity = { ...newActivity, _id: result.insertedId };

    res.status(201).json({ activity: activityToClient(activity) });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Update activity
router.put('/:id', validate(schemas.updateActivity), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activityId = req.params.id;
    const { description, time_frame, custom_date, priority, notes } = req.body;

    const db = dbConnection.getDb();
    const activitiesCollection = db.collection<Activity>(COLLECTIONS.ACTIVITIES);

    const updateFields: any = { updated_at: new Date() };
    if (description) updateFields.description = description;
    if (time_frame) updateFields.time_frame = time_frame;
    if (custom_date !== undefined) updateFields.custom_date = custom_date ? new Date(custom_date) : null;
    if (priority) updateFields.priority = priority;
    if (notes !== undefined) updateFields.notes = notes;

    const result = await activitiesCollection.updateOne(
      { _id: new ObjectId(activityId) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Toggle activity completion
router.patch('/:id/toggle', validate(schemas.idParam), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activityId = req.params.id;

    const db = dbConnection.getDb();
    const activitiesCollection = db.collection<Activity>(COLLECTIONS.ACTIVITIES);

    const activity = await activitiesCollection.findOne({
      _id: new ObjectId(activityId),
    });

    if (!activity) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    await activitiesCollection.updateOne(
      { _id: new ObjectId(activityId) },
      {
        $set: {
          completed: !activity.completed,
          updated_at: new Date(),
        },
      }
    );

    res.json({ success: true, completed: !activity.completed });
  } catch (error) {
    console.error('Toggle activity error:', error);
    res.status(500).json({ error: 'Failed to toggle activity' });
  }
});

// Delete activity
router.delete('/:id', validate(schemas.idParam), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activityId = req.params.id;

    const db = dbConnection.getDb();
    const activitiesCollection = db.collection<Activity>(COLLECTIONS.ACTIVITIES);

    const result = await activitiesCollection.deleteOne({
      _id: new ObjectId(activityId),
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: 'Activity not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;
