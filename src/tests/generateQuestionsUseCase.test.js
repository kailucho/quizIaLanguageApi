import { GenerateQuestionsUseCase } from '../application/useCases/GenerateQuestionsUseCase.js';

describe('GenerateQuestionsUseCase', () => {
  let mockQuestionRepository;
  let mockOpenAIService;
  let generateQuestionsUseCase;

  beforeEach(() => {
    mockQuestionRepository = {
      save: jest.fn(),
    };

    mockOpenAIService = {
      generateQuestions: jest.fn(),
    };

    generateQuestionsUseCase = new GenerateQuestionsUseCase(
      mockQuestionRepository,
      mockOpenAIService
    );
  });

  it('should generate questions and save them to the repository', async () => {
    const input = { content: 'Geography, Capitals', language: 'English' };
    const mockGeneratedQuestions = [
      {
        questionText: 'What is the capital of France?',
        options: ['Paris', 'Berlin', 'Madrid'],
        correctAnswer: 'Paris',
      },
    ];

    mockOpenAIService.generateQuestions.mockResolvedValue(mockGeneratedQuestions);
    mockQuestionRepository.save.mockResolvedValue(mockGeneratedQuestions[0]);

    const questions = await generateQuestionsUseCase.execute(input);

    expect(mockOpenAIService.generateQuestions).toHaveBeenCalledWith(
      input.content,
      input.language
    );
    expect(mockQuestionRepository.save).toHaveBeenCalledWith(expect.any(Object));
    expect(questions).toHaveLength(1);
    expect(questions[0].questionText).toBe('What is the capital of France?');
  });
});