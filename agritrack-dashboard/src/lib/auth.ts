import { api } from './api';
import type { UserClient, Session, AuthError } from '@/types/database';

/**
 * Authentication Utilities using Backend API
 * 
 * Provides authentication functions using the Express backend API
 * with JWT for session management
 */

/**
 * Register a new user using Backend API
 */
export async function registerUser(
  username: string,
  password: string,
  metadata?: { full_name?: string }
): Promise<{ user: UserClient | null; error: AuthError | null }> {
  try {
    const response = await api.auth.register(
      username,
      password,
      metadata?.full_name
    );

    const { user, token } = response.data;

    if (!user || !token) {
      return {
        user: null,
        error: { message: 'Registration failed - invalid response' },
      };
    }

    return { user, error: null };
  } catch (error: any) {
    console.error('Registration error:', error);
    const message = error.response?.data?.error || error.message || 'Registration failed';
    return {
      user: null,
      error: { message },
    };
  }
}

/**
 * Login a user using Backend API
 */
export async function loginUser(
  username: string,
  password: string
): Promise<{ session: Session | null; error: AuthError | null }> {
  try {
    const response = await api.auth.login(username, password);
    const { user, token } = response.data;

    if (!user || !token) {
      return {
        session: null,
        error: { message: 'Login failed - invalid response' },
      };
    }

    // Create session object
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const session: Session = {
      user,
      token,
      expiresAt,
    };

    return { session, error: null };
  } catch (error: any) {
    console.error('Login error:', error);
    const message = error.response?.data?.error || 'Invalid username or password';
    return {
      session: null,
      error: { message },
    };
  }
}

/**
 * Get current user from Backend API
 */
export async function getCurrentUser(token: string): Promise<UserClient | null> {
  try {
    const response = await api.auth.getCurrentUser();
    return response.data.user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Session storage helpers
 */
export const SESSION_STORAGE_KEY = 'agritrack_session';

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  try {
    const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr) as Session;
    
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
