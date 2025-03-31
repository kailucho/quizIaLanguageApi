export class Question {
  constructor({ id, questionText, options, correctAnswer, difficulty, topic, createdAt }) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
    this.difficulty = difficulty;
    this.topic = topic;
    this.createdAt = createdAt;
  }

  validate() {
    if (!this.questionText) throw new Error('Question text is required');
    if (!this.options || this.options.length < 3) throw new Error('Question must have at least 3 options');
    if (!this.correctAnswer) throw new Error('Correct answer is required');
    if (!this.options.includes(this.correctAnswer)) {
      throw new Error('Correct answer must be one of the options');
    }
  }

  toJSON() {
    return {
      id: this.id,
      questionText: this.questionText,
      options: this.options,
      correctAnswer: this.correctAnswer,
      difficulty: this.difficulty,
      topic: this.topic,
      createdAt: this.createdAt
    };
  }
}