// MongoDB Database Types for Backend API
// Backend API returns string IDs instead of ObjectId

export interface User {
  _id?: string;
  username: string;
  email: string; // Format: username@agritrack.local
  full_name?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  _id?: string;
  user_id: string; // Backend user ID (string)
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: Date;
}

export interface Farm {
  _id?: string;
  owner_id: string; // Backend user ID (string)
  name: string;
  location?: string;
  size_acres?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Expense {
  _id?: string;
  farm_id: string; // Farm ID as string
  category: string;
  description?: string;
  amount: number;
  date: Date;
  receipt_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Income {
  _id?: string;
  farm_id: string; // Farm ID as string
  source: string;
  description?: string;
  amount: number;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  _id?: string;
  farm_id: string; // Farm ID as string
  description: string;
  time_frame: 'today' | 'this-week' | 'this-month' | 'custom';
  custom_date?: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

// Client-side types (without BSON.ObjectId, using string IDs)
export interface UserClient {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
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
  description?: string;
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
  custom_date?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// Session and Auth types
export interface Session {
  user: UserClient;
  token: string;
  expiresAt: Date;
}

export interface AuthError {
  message: string;
  code?: string;
}
