import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Validation middleware factory
 * Creates Express middleware from Zod schemas
 */
export const validate = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: z.ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        
        res.status(400).json({
          error: 'Validation failed',
          details: errorMessages,
        });
        return;
      }
      
      res.status(500).json({ error: 'Validation error' });
      return;
    }
  };
};

// Common validation schemas
export const schemas = {
  // Auth schemas
  register: z.object({
    body: z.object({
      username: z.string().min(3).max(50),
      password: z.string().min(6).max(100),
      full_name: z.string().min(1).max(100).optional(),
    }),
  }),

  login: z.object({
    body: z.object({
      username: z.string().min(3),
      password: z.string().min(6),
    }),
  }),

  // Farm schemas
  createFarm: z.object({
    body: z.object({
      name: z.string().min(1).max(100),
      location: z.string().max(200).optional(),
      size_acres: z.number().positive().optional(),
    }),
  }),

  updateFarm: z.object({
    body: z.object({
      name: z.string().min(1).max(100).optional(),
      location: z.string().max(200).optional(),
      size_acres: z.number().positive().optional(),
    }),
    params: z.object({
      id: z.string(),
    }),
  }),

  // Expense schemas
  createExpense: z.object({
    body: z.object({
      farm_id: z.string(),
      category: z.string().min(1).max(50),
      description: z.string().min(1).max(500),
      amount: z.number().positive(),
      date: z.string(),
    }),
  }),

  updateExpense: z.object({
    body: z.object({
      category: z.string().min(1).max(50).optional(),
      description: z.string().min(1).max(500).optional(),
      amount: z.number().positive().optional(),
      date: z.string().optional(),
    }),
    params: z.object({
      id: z.string(),
    }),
  }),

  // Income schemas
  createIncome: z.object({
    body: z.object({
      farm_id: z.string(),
      source: z.string().min(1).max(50),
      description: z.string().max(500).optional(),
      amount: z.number().positive(),
      date: z.string(),
    }),
  }),

  updateIncome: z.object({
    body: z.object({
      source: z.string().min(1).max(50).optional(),
      description: z.string().max(500).optional(),
      amount: z.number().positive().optional(),
      date: z.string().optional(),
    }),
    params: z.object({
      id: z.string(),
    }),
  }),

  // Activity schemas
  createActivity: z.object({
    body: z.object({
      farm_id: z.string(),
      description: z.string().min(1).max(500),
      time_frame: z.enum(['today', 'this-week', 'this-month', 'custom']),
      custom_date: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high']),
      notes: z.string().max(1000).optional(),
    }),
  }),

  updateActivity: z.object({
    body: z.object({
      description: z.string().min(1).max(500).optional(),
      time_frame: z.enum(['today', 'this-week', 'this-month', 'custom']).optional(),
      custom_date: z.string().optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      notes: z.string().max(1000).optional(),
    }),
    params: z.object({
      id: z.string(),
    }),
  }),

  // Query params validation
  farmIdQuery: z.object({
    query: z.object({
      farm_id: z.string(),
    }),
  }),

  idParam: z.object({
    params: z.object({
      id: z.string(),
    }),
  }),
};
