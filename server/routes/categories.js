const express = require('express');
const categoryCtrl = require('../controllers/categories');
const Category = require('../models/Category');
const categoryData = require('../data/categories.json');

const router = express.Router();
/**
 * Get all categories
 */
router.post('/populate', (req, res) => {
  const promises = categoryData.map(
    (category) =>
      new Promise((resolve, reject) => {
        new Category(category)
          .save()
          .then(() => resolve())
          .catch((err) => reject(err));
      })
  );
  Promise.all(promises).then(() => {
    Category.find()
      .then((categories) => res.status(200).json(categories))
      .catch((error) => res.status(400).json({ error }));
  });
});
router.get('/:id', categoryCtrl.getOneCategory);
router.get('/', categoryCtrl.getAllCategories);
module.exports = router;
