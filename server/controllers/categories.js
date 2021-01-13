const Category = require('../models/Category');

exports.getAllCategories = (req, res) => {
  Category.find().then((categories) => {
    res.status(200).json({ categories });
  });
};

exports.getOneCategory = (req, res) => {
  const { id } = req.params;
  Category.findById(id).then((categorie) => {
    res.status(200).json({ categorie });
  });
};
