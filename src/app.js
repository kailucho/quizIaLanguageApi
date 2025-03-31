import './config/index.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { swaggerDocs, swaggerUi } from './config/index.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Register all routes
routes(app);

app.use(errorHandler);

export default app;
