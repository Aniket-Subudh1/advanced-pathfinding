import winston from 'winston';
import { appConfig } from '../config';

const { format, transports } = winston;
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, ...rest }) => {
  let logMessage = `${timestamp} ${level}: ${message}`;
  
  // Include additional metadata if available
  if (Object.keys(rest).length > 0) {
    logMessage += ` ${JSON.stringify(rest)}`;
  }
  
  return logMessage;
});

// Create logger
const logger = winston.createLogger({
  level: appConfig.logging.level,
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      )
    }),
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Don't log to files in test environment
if (process.env.NODE_ENV === 'test') {
  logger.transports.forEach((transport) => {
    if (transport instanceof winston.transports.File) {
      logger.remove(transport);
    }
  });
}

export default logger;