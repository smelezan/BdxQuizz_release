const express = require('express');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.get('/', userCtrl.getUser);
module.exports = router;
