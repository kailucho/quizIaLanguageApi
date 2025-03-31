import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';
import questionRoutes from './questionRoutes.js';
import { QuestionController } from '../infrastructure/controllers/QuestionController.js';
import { MongoQuestionRepository } from '../infrastructure/repositories/MongoQuestionRepository.js';
import { OpenAIService } from '../infrastructure/services/OpenAIService.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz English API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
const routes = (app) => {
  const questionRepository = new MongoQuestionRepository();
  const openAIService = new OpenAIService();
  const questionController = new QuestionController(
    questionRepository,
    openAIService
  );

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/questions', questionRoutes(questionController));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default routes;
