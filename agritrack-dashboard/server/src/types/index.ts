import { ObjectId } from 'mongodb';

// Database types (server-side with ObjectId)
export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string; // Hashed
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  _id?: ObjectId;
  user_id: ObjectId;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: Date;
}

export interface Farm {
  _id?: ObjectId;
  owner_id: ObjectId;
  name: string;
  location?: string;
  size_acres?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Expense {
  _id?: ObjectId;
  farm_id: ObjectId;
  category: string;
  description: string;
  amount: number;
  date: Date;
  receipt_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Income {
  _id?: ObjectId;
  farm_id: ObjectId;
  source: string;
  description?: string;
  amount: number;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  _id?: ObjectId;
  farm_id: ObjectId;
  description: string;
  time_frame: 'today' | 'this-week' | 'this-month' | 'custom';
  custom_date?: Date | null;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

// Client-safe types (for API responses)
export interface UserClient {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface FarmClient {
  id: string;
  owner_id: string;
  name: string;
  location?: string;
  size_acres?: number;
  created_at: string;
  updated_at: string;
}

export interface ExpenseClient {
  id: string;
  farm_id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeClient {
  id: string;
  farm_id: string;
  source: string;
  description?: string;
  amount: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityClient {
  id: string;
  farm_id: string;
  description: string;
  time_frame: 'today' | 'this-week' | 'this-month' | 'custom';
  custom_date?: string | null;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Helper functions to convert database types to client types
export function userToClient(user: User): UserClient {
  return {
    id: user._id!.toString(),
    username: user.username,
    email: user.email,
    created_at: user.created_at.toISOString(),
  };
}

export function farmToClient(farm: Farm): FarmClient {
  return {
    id: farm._id!.toString(),
    owner_id: farm.owner_id.toString(),
    name: farm.name,
    location: farm.location,
    size_acres: farm.size_acres,
    created_at: farm.created_at.toISOString(),
    updated_at: farm.updated_at.toISOString(),
  };
}

export function expenseToClient(expense: Expense): ExpenseClient {
  return {
    id: expense._id!.toString(),
    farm_id: expense.farm_id.toString(),
    category: expense.category,
    description: expense.description,
    amount: expense.amount,
    date: expense.date.toISOString().split('T')[0],
    receipt_url: expense.receipt_url,
    created_at: expense.created_at.toISOString(),
    updated_at: expense.updated_at.toISOString(),
  };
}

export function incomeToClient(income: Income): IncomeClient {
  return {
    id: income._id!.toString(),
    farm_id: income.farm_id.toString(),
    source: income.source,
    description: income.description,
    amount: income.amount,
    date: income.date.toISOString().split('T')[0],
    created_at: income.created_at.toISOString(),
    updated_at: income.updated_at.toISOString(),
  };
}

export function activityToClient(activity: Activity): ActivityClient {
  return {
    id: activity._id!.toString(),
    farm_id: activity.farm_id.toString(),
    description: activity.description,
    time_frame: activity.time_frame,
    custom_date: activity.custom_date ? activity.custom_date.toISOString().split('T')[0] : null,
    priority: activity.priority,
    notes: activity.notes,
    completed: activity.completed,
    created_at: activity.created_at.toISOString(),
    updated_at: activity.updated_at.toISOString(),
  };
}
