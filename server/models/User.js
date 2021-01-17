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
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
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

User.plugin(uniqueValidator);
module.exports = mongoose.model("User", User);

