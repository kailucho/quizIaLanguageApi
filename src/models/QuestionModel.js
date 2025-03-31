import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionText: { type: String, required: true, trim: true },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length > 2,
      message: 'There must be more than 2 options.'
    }
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return this.options.includes(value);
      },
      message: 'The correct answer must be among the options.'
    }
  }
});

questionSchema.index({ questionText: 1 });

export default mongoose.model('Question', questionSchema);
