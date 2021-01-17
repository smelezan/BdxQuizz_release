const mongoose = require('mongoose');
const roomManagement = require('../utils/roomManagement');

const Room = mongoose.Schema({
  mode: {
    type: String,
    required: true,
    enum: ['ENDLESS', 'ZEN', 'STANDARD'],
  },
  roomCode: {
    type: String,
    required: false,
  },
  nbQuestions: {
    type: Number,
    required: false,
  },
  currentNoQuestion: {
    type: Number,
    default: -1,
  },
  difficulty: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  players: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  questions: {
    type: [
      {
        question: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        difficulty: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        correct_answer: {
          type: String,
          required: true,
        },
        incorrect_answers: {
          type: [String],
          required: true,
        },
      },
    ],
    required: true,
  },
});

Room.methods.getNextQuestion = async function getNextQuestion(isFirst) {
  if (isFirst) {
    this.currentNoQuestion = -1;
  }
  switch (this.mode) {
    case 'ENDLESS': {
      if (this.currentNoQuestion + 1 >= this.nbQuestions) {
        return undefined;
      }
      if (this.currentNoQuestion + 5 === this.nbQuestions) {
        const questions = await roomManagement.getNextQuestionEndless({
          category: this.category,
          difficulty: this.difficulty,
        });
        this.questions.push(questions);
      }
      this.currentNoQuestion += 1;
      await this.save();
      return this.questions[this.currentNoQuestion];
    }

    default: {
      if (this.currentNoQuestion + 1 === this.nbQuestions) {
        return undefined;
      }
      this.currentNoQuestion += 1;
      await this.save();
      console.log(
        `getNextQuestion ${this.roomCode} - ${this.currentNoQuestion}`
      );
      return this.questions[this.currentNoQuestion];
    }
  }
};

Room.methods.getAnswer = async function getAnswer(answer) {
  const correctAnswer = this.questions[this.currentNoQuestion].correct_answer;
  switch (this.mode) {
    case 'ENDLESS': {
      if (answer !== correctAnswer) {
        this.currentNoQuestion = this.nbQuestions;
        await this.save();
      }
      break;
    }
    default:
      break;
  }
  return correctAnswer;
};

module.exports = mongoose.model('Room', Room);
