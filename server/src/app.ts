import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler, requestLogger } from './middleware';

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(requestLogger);


app.use('/api', routes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
