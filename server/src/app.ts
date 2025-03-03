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
