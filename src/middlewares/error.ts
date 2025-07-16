import { Context, Next } from 'koa';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = () => async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof AppError) {
      ctx.status = err.statusCode;
      ctx.body = {
        code: err.code || err.statusCode,
        message: err.message,
        data: err.data,
      };
    } else {
      logger.error('Unhandled error:', err);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: 'Internal Server Error',
      };
    }
  }
}; 