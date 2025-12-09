import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Error Handler Utility
 * 
 * Centralized error handling for consistent error messages
 * and user-friendly error display across the application.
 */

export interface AppError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Format Supabase PostgrestError into user-friendly message
 */
export function formatSupabaseError(error: PostgrestError): AppError {
  // Common Supabase error codes and their user-friendly messages
  const errorMessages: Record<string, string> = {
    '23505': 'This record already exists. Please use a different value.',
    '23503': 'Cannot delete this item because it is being used elsewhere.',
    '23502': 'Required field is missing. Please fill in all required fields.',
    '42501': 'You do not have permission to perform this action.',
    'PGRST116': 'No data found matching your request.',
    'PGRST301': 'Invalid request. Please check your input.',
  };

  const userMessage = errorMessages[error.code] || error.message;

  return {
    message: userMessage,
    code: error.code,
    details: error.details,
    hint: error.hint,
  };
}

/**
 * Format generic JavaScript Error
 */
export function formatGenericError(error: Error): AppError {
  return {
    message: error.message || 'An unexpected error occurred',
  };
}

/**
 * Handle and display error with toast notification
 */
export function handleError(error: unknown, context?: string): AppError {
  let appError: AppError;

  // Supabase PostgrestError
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    appError = formatSupabaseError(error as PostgrestError);
  }
  // JavaScript Error
  else if (error instanceof Error) {
    appError = formatGenericError(error);
  }
  // String error
  else if (typeof error === 'string') {
    appError = { message: error };
  }
  // Unknown error type
  else {
    appError = { message: 'An unexpected error occurred' };
  }

  // Add context if provided
  const displayMessage = context 
    ? `${context}: ${appError.message}`
    : appError.message;

  // Show toast notification
  toast.error(displayMessage, {
    description: appError.hint || appError.details,
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      context,
      error,
      formatted: appError,
    });
  }

  return appError;
}

/**
 * Async error handler wrapper for async functions
 * 
 * Usage:
 * const result = await withErrorHandler(
 *   async () => await supabase.from('table').select(),
 *   'Failed to load data'
 * );
 */
export async function withErrorHandler<T>(
  fn: () => Promise<T>,
  errorContext?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, errorContext);
    return null;
  }
}

/**
 * Validation error helper
 */
export function createValidationError(field: string, message: string): AppError {
  return {
    message: `${field}: ${message}`,
    code: 'VALIDATION_ERROR',
  };
}

/**
 * Network error helper
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    );
  }
  return false;
}

/**
 * Handle network errors specifically
 */
export function handleNetworkError(): AppError {
  const error: AppError = {
    message: 'Network connection issue',
    details: 'Please check your internet connection and try again.',
  };

  toast.error(error.message, {
    description: error.details,
  });

  return error;
}

/**
 * Authentication error helper
 */
export function handleAuthError(error: unknown): AppError {
  const appError = handleError(error, 'Authentication failed');
  
  // Additional auth-specific handling
  if (appError.message.includes('Invalid login credentials')) {
    return {
      message: 'Invalid username or password',
      hint: 'Please check your credentials and try again.',
    };
  }

  return appError;
}
