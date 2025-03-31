import dotenv from 'dotenv';
dotenv.config();

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import app from './src/app.js'; // Corrige la ruta para importar el archivo correcto
import winston from 'winston';
import { connectDB } from './src/config/index.js';

const port = process.env.PORT || 5000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

app.use((req, res, next) => {
  logger.info({
    message: 'Request received',
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  });
  next();
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz English API',
      version: '1.0.0',
      description: 'API for generating English quiz questions using OpenAI',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./controllers/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default app;

connectDB()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      console.log(
        `Swagger docs available at http://localhost:${port}/api-docs`
      );
    });
  })
  .catch((error) => {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
  });
