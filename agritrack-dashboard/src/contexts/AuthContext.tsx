import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  registerUser, 
  loginUser, 
  getCurrentUser,
  saveSession,
  getSession,
  clearSession
} from '@/lib/auth';
import type { UserClient, Session, AuthError } from '@/types/database';

interface AuthContextType {
  user: UserClient | null;
  session: Session | null;
  loading: boolean;
  signUp: (username: string, password: string, metadata?: { username?: string; full_name?: string }) => Promise<{ error: AuthError | null }>;
  signIn: (username: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      try {
        const existingSession = getSession();
        
        if (existingSession) {
          // Verify session is still valid by fetching current user
          const currentUser = await getCurrentUser(existingSession.token);
          
          if (currentUser) {
            setSession(existingSession);
            setUser(currentUser);
          } else {
            // Session invalid, clear it
            clearSession();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (username: string, password: string, metadata?: { username?: string; full_name?: string }) => {
    try {
      const { user: newUser, error } = await registerUser(
        username,
        password,
        { full_name: metadata?.full_name || metadata?.username }
      );

      if (error || !newUser) {
        return { error: error || { message: 'Registration failed' } };
      }

      // Auto-login after successful registration
      const { session: newSession, error: loginError } = await loginUser(username, password);
      
      if (loginError || !newSession) {
        return { error: loginError || { message: 'Auto-login failed' } };
      }

      setSession(newSession);
      setUser(newSession.user);
      saveSession(newSession);

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: { message: 'Registration failed' } };
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const { session: newSession, error } = await loginUser(username, password);
      
      if (error || !newSession) {
        return { error: error || { message: 'Login failed' } };
      }

      setSession(newSession);
      setUser(newSession.user);
      saveSession(newSession);

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'Login failed' } };
    }
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    clearSession();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
