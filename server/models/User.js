const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  notifications: {
    friends: {
      type: [String],
      required: true,
    },
    games: {
      type: [Object],
      required: true,
    }
  },
  friendList: {
    type: [String],
    required: true,
  },
  stats: {
    nbQuizzWon: {
      type: Number,
      default: 0
    },
    nbQuizzLost: {
      type: Number,
      default: 0
    },
    nbQuizzPlayed: {
      type: Number,
      default: 0
    },
    successRatio: {
      type: Number,
      default: 0,
    },
    bestScore: {
      type: Number,
      default: -1
    },
    averageScore: {
      type: Number,
      default: -1
    },
    bestTime: {
      type: String,
      default: ''
    },
    averageTime: {
      type: String,
      default: ''
    },
    category: {
      type: Object,
    }
  }

}, { strict: false })

User.methods.updateSuccessRatio = async function updateSuccessRatio() {
  if (this.stats.nbQuizzWon + this.stats.nbQuizzLost > 0)
    this.stats.successRatio =
      (this.stats.nbQuizzWon /
        (this.stats.nbQuizzWon + this.stats.nbQuizzLost)) *
      100;
  await this.save();
};

User.methods.updateNumberOfQuizzPlayed = async function () {
  this.stats.nbQuizzPlayed = (Number)(this.stats.nbQuizzWon + this.stats.nbQuizzLost);
  await this.save();
};

User.methods.updateBestScore = async function (newScore) {
  if (this.stats.bestScore == -1) {
    this.stats.bestScore = newScore
  }
  else if (newScore > this.stats.bestScore) {
    this.stats.bestScore = newScore;
  }
  await this.save();
};

User.methods.updateAverageScore = async function (newScore) {
  if (this.stats.averageScore == -1) {
    this.stats.averageScore = this.stats.bestScore;
  }
  else {
    this.stats.averageScore = (this.stats.averageScore * this.stats.nbQuizzPlayed - 1 + newScore) / this.stats.nbQuizzPlayed;
  }
  await this.save();
};

User.plugin(uniqueValidator);
module.exports = mongoose.model("User", User);

