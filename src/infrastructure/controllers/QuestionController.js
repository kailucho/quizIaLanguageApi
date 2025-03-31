import { GenerateQuestionsUseCase } from '../../application/useCases/GenerateQuestionsUseCase.js';

export class QuestionController {
  constructor(questionRepository, openAIService) {
    this.generateQuestionsUseCase = new GenerateQuestionsUseCase(
      questionRepository,
      openAIService
    );
  }

  async getQuestions(req, res) {
    try {
      const { selectedContent: content, language, difficulty } = req.body;
      const questions = await this.generateQuestionsUseCase.execute({
        content,
        language,
        difficulty,
      });

      // Ensure all questions are instances of the Question class
      const serializedQuestions = questions.map((q) => {
        if (typeof q.toJSON === 'function') {
          return q.toJSON();
        } else {
          throw new Error('Invalid question object: Missing toJSON method');
        }
      });

      res.json({ success: true, questions: serializedQuestions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
