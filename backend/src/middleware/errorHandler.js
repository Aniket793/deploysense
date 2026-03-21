import logger from './logger.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'A repository with this URL already exists'
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: 'Record not found'
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
};