const mongoose = require('mongoose');

const Category = mongoose.Schema({
  categoryId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  stats: {
    totalPlayed: {
      type: Number,
      default: 0,
    },
    nbGoodAnswers: {
      type: Number,
      default: 0,
    },
    nbBadAnswers: {
      type: Number,
      default: 0,
    },
    successRatio: {
      type: Number,
      default: 0,
    },
  },
});

Category.methods.getSuccessRatio = async function getSuccessRatio() {
  if (this.stats.nbGoodAnswers + this.stats.nbBadAnswers > 0)
    this.stats.successRatio =
      (this.stats.nbGoodAnswers /
        (this.stats.nbGoodAnswers + this.stats.nbBadAnswers)) *
      100;
  await this.save();
};

module.exports = mongoose.model('Category', Category);
