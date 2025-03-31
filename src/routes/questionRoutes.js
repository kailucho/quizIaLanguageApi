import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Generate English exam questions
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The topic, vocabulary, and grammar for the questions
 *                 example: "Present Simple, Vocabulary: daily routines"
 *     responses:
 *       200:
 *         description: A list of generated questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionText:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                       correctAnswer:
 *                         type: string
 *       400:
 *         description: Invalid input
 */

const questionRoutes = (questionController) => {
  const router = express.Router();

  router.post(
    '/',
    authMiddleware,
    questionController.getQuestions.bind(questionController)
  );

  return router;
};

export default questionRoutes;
