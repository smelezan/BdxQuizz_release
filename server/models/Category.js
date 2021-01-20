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
    bestPlayer: {
      type: String,
      default: '',
    },
    bestScore: {
      type: Number,
      default: 0,
    }
  },
});

Category.methods.updateBestPlayer = async function updateBestPlayer(name, score) {
  if (this.stats.bestScore < score){
    this.stats.bestScore = score;
    this.stats.bestPlayer = name;
    await this.save();
  }
};

module.exports = mongoose.model('Category', Category);
