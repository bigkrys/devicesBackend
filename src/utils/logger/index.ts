import winston from 'winston';
import { config } from '../../config';

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    timestamp(),
    colorize(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
}); 