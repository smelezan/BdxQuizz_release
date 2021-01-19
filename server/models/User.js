const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const User = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    stats: {
      nbQuizzWon: {
        type: Number,
        default: 0,
      },
      nbQuizzLost: {
        type: Number,
        default: 0,
      },
      nbQuizzPlayed: {
        type: Number,
        default: 0,
      },
      bestEndlessScore: {
        type: Number,
        default: -1,
      },
      scores: {
        type: [Number],
        default: [],
      },
      bestScore: {
        type: Number,
        default: -1,
      },
      averageScore: {
        type: Number,
        default: -1,
      },
      times: {
        type: [Number],
        default: [],
      },
      bestTime: {
        type: String,
        default: '',
      },
      averageTime: {
        type: String,
        default: '',
      },
      category: {
        type: Object,
      },
    },
  },
  { strict: false }
);

User.methods.updateNumberOfQuizzPlayed = async function () {
  this.stats.nbQuizzPlayed = Number(
    this.stats.nbQuizzWon + this.stats.nbQuizzLost
  );
  await this.save();
};

User.methods.updateBestScore = async function (newScore, newTime) {
  this.stats.scores.push(newScore);

  let splitNewTime = newTime.split(":");
  this.stats.times.push(splitNewTime[0] * 60 + splitNewTime[1]);
  if (this.stats.bestScore === -1) {
    this.stats.bestTime = newTime
    this.stats.bestScore = newScore;
  } else if (newScore > this.stats.bestScore) {
    this.stats.bestTime = newTime
    this.stats.bestScore = newScore;
  } else if (newScore == this.stats.bestScore) {
    let oldTime = this.stats.bestTime.split(":");
    if (splitNewTime[0] < oldTime[0]) {
      this.stats.bestTime = newTime;
    }
    else if (splitNewTime[0] == oldTime[0]) {
      if (splitNewTime[1] < oldTime[1]) {
        this.stats.bestTime = newTime;
      }
    }
  }
  await this.save();
};

User.methods.updateBestEndlessScore = async function (newScore) {
  if (this.stats.bestScore === -1) {
    this.stats.bestEndlessScore = newScore;
  } else if (newScore > this.stats.bestEndlessScore) {
    this.stats.bestEndlessScore = newScore;
  }
  await this.save();
};

User.methods.updateAverageScore = async function (newScore) {
  let averageScore = this.stats.averageScore;
  if (averageScore === -1) {
    averageScore = this.stats.bestScore;
  } else {
    averageScore = (averageScore * (this.stats.nbQuizzPlayed - 1) + newScore) / this.stats.nbQuizzPlayed;
  }
  this.stats.averageScore = averageScore.toFixed(2);
  await this.save();
}

User.methods.updateAverageTime = async function (newTime) {
  let averageTime = this.stats.averageTime;
  if (averageTime === '') {
    averageTime = this.stats.bestTime;
  }else{
    let splitNewTime = newTime.split(":");
    let splitOldAverageTime = averageTime.split(":");

    let averageMin = (parseInt(splitOldAverageTime[0]) * (this.stats.nbQuizzPlayed - 1) + parseInt(splitNewTime[0])) / this.stats.nbQuizzPlayed;
    let averageSeconde = (parseInt(splitOldAverageTime[1]) * (this.stats.nbQuizzPlayed - 1) + parseInt(splitNewTime[1])) / this.stats.nbQuizzPlayed;
    averageTime = averageMin.toFixed(2) + ":" + averageSeconde.toFixed(2);
  }
  this.stats.averageTime = averageTime;
  await this.save();
};

User.plugin(uniqueValidator);
module.exports = mongoose.model('User', User);
