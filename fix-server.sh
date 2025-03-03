#!/bin/bash
# Fix for server file structure issues

# Make sure we're in the project root
cd advanced-pathfinding 2>/dev/null || echo "Run this script from the project root directory"

# Check if server.ts exists in the server/src directory
if [ ! -f "server/src/server.ts" ]; then
  echo "Error: server.ts file is missing. Creating it now..."
  
  # First, check if app.ts exists
  if [ ! -f "server/src/app.ts" ]; then
    # Create app.ts
    cat > server/src/app.ts << 'EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, requestLogger } from './middleware';

// Initialize express app
const app = express();

// Apply middleware
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Apply custom request logger
app.use(requestLogger);

// API routes
app.use('/api', routes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Apply error handling middleware
app.use(errorHandler);

export default app;
EOF
    echo "Created app.ts"
  fi

  # Create server.ts
  cat > server/src/server.ts << 'EOF'
import app from './app';
import { logger } from './utils';

const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.stack || error.message });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', { reason, promise });
  process.exit(1);
});
EOF
  echo "Created server.ts"
fi

# Update server package.json to include necessary dependencies
cat > server/package.json << 'EOF'
{
  "name": "server",
  "version": "1.0.0",
  "description": "Express server for advanced pathfinding visualization",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint . --fix"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "uuid": "^9.0.0",
    "winston": "^3.10.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.14",
    "@types/express": "^4.17.18",
    "@types/morgan": "^1.9.6",
    "@types/node": "^20.8.2",
    "@types/uuid": "^9.0.7",
    "@typescript-eslint/eslint-plugin": "^6.7.3",
    "@typescript-eslint/parser": "^6.7.3",
    "eslint": "^8.50.0",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  }
}
EOF
echo "Updated server package.json"

# Create nodemon configuration
cat > server/nodemon.json << 'EOF'
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node ./src/server.ts"
}
EOF
echo "Created nodemon.json"

# Install server dependencies
echo "Installing server dependencies..."
cd server && npm install && cd ..

# Check if middleware and utils folder have the necessary files
if [ ! -d "server/src/middleware" ]; then
  mkdir -p server/src/middleware
  
  # Create middleware files
  cat > server/src/middleware/error.middleware.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log the error
  logger.error(`Error processing request: ${err.message}`, {
    error: err.stack,
    path: req.path,
    method: req.method
  });
  
  // Handle unexpected errors
  return res.status(500).json({
    error: {
      message: 'An unexpected error occurred',
      ...(process.env.NODE_ENV !== 'production' && { originalError: err.message })
    }
  });
};
EOF

  cat > server/src/middleware/logging.middleware.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils';

export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { method, path, params, query, body } = req;
  
  logger.info(`Request received: ${method} ${path}`, {
    params,
    query,
    body: process.env.NODE_ENV !== 'production' ? body : undefined
  });
  
  next();
};
EOF

  cat > server/src/middleware/index.ts << 'EOF'
export { errorHandler } from './error.middleware';
export { requestLogger } from './logging.middleware';
EOF

  echo "Created middleware files"
fi

if [ ! -d "server/src/utils" ]; then
  mkdir -p server/src/utils
  
  # Create utils files
  cat > server/src/utils/logger.ts << 'EOF'
import winston from 'winston';

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
  level: 'info',
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
    })
  ]
});

export default logger;
EOF

  cat > server/src/utils/index.ts << 'EOF'
export { default as logger } from './logger';
EOF

  echo "Created utils files"
fi

if [ ! -d "server/src/routes" ]; then
  mkdir -p server/src/routes
  
  # Create routes files
  cat > server/src/routes/index.ts << 'EOF'
import { Router } from 'express';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default router;
EOF

  echo "Created routes files"
fi

echo "Server files have been fixed. Try running npm run dev again."
