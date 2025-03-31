import { IQuestionRepository } from '../../domain/repositories/IQuestionRepository.js';
import QuestionModel from '../../models/QuestionModel.js';

export class MongoQuestionRepository extends IQuestionRepository {
  async save(question) {
    const newQuestion = new QuestionModel(question);
    return await newQuestion.save();
  }

  async findById(id) {
    return await QuestionModel.findById(id);
  }

  async findByTopic(topic) {
    return await QuestionModel.find({ topic });
  }

  async findAll() {
    return await QuestionModel.find();
  }

  async delete(id) {
    return await QuestionModel.findByIdAndDelete(id);
  }
}