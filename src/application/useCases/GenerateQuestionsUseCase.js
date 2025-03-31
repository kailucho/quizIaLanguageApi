import { Question } from '../../domain/entities/Question.js';
import { IQuestionRepository } from '../../domain/repositories/IQuestionRepository.js';
import { redisClient } from '../../config/index.js';

export class GenerateQuestionsUseCase {
  constructor(questionRepository, openAIService) {
    this.questionRepository = questionRepository;
    this.openAIService = openAIService;
  }

  async execute(input) {
    if (!input || typeof input !== 'object') {
      throw new Error('Invalid input provided.');
    }

    const { content, language, difficulty = 'medium' } = input;

    if (!content) {
      throw new Error('Invalid input provided.');
    }

    const cacheKey = `questions:${content}:${language}:${difficulty}`;
    let cachedQuestions = null;

    if (redisClient) {
      cachedQuestions = await redisClient.get(cacheKey);
    }

    if (cachedQuestions) {
      // Rehydrate cached questions into Question instances
      return JSON.parse(cachedQuestions).map(q => new Question(q));
    }

    try {
      const generatedQuestions = await this.openAIService.generateQuestions(content, language);
      const validQuestions = generatedQuestions.filter(q => q.options.includes(q.correctAnswer));

      const questions = validQuestions.map(q => {
        const question = new Question({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          difficulty,
          topic: content,
          createdAt: new Date()
        });

        question.validate();
        return question;
      });

      const savedQuestions = await Promise.all(questions.map(q => this.questionRepository.save(q)));

      // Cache the questions for 1 hour if Redis is enabled
      if (redisClient) {
        await redisClient.set(cacheKey, JSON.stringify(savedQuestions), {
          EX: 3600,
        });
      }

      return savedQuestions;
    } catch (error) {
      throw new Error(`Error generating questions: ${error.message}`);
    }
  }
}