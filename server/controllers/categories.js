const Category = require('../models/Category');

exports.getAllCategories = (req, res) => {
  Category.find().then((categories) => {
    res.status(200).json({ categories });
  });
};
