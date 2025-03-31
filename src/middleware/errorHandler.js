import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log' }),
  ],
});

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  logger.error({
    correlationId,
    message: err.message,
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      correlationId,
    },
  });
};

export default errorHandler;