const express = require('express');
const categoryCtrl = require('../controllers/categories');

const router = express.Router();
/**
 * Get all categories
 */
router.get('/', categoryCtrl.getAllCategories);

module.exports = router;
