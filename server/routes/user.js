const express = require('express');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.get('/', userCtrl.getUser);
router.get('/notifications/:id', userCtrl.getNotifications);
router.post('/invite/:id', userCtrl.sendFriendRequest);
router.post('/cancel/:id', userCtrl.cancelFriendRequest);
router.post('/accept/:id', userCtrl.acceptFriendRequest);
// router.post('/:id', userCtrl.sendPlayingInvitation);
// router.post('/cancel/:id', userCtrl.cancelPlayingInvitation);

module.exports = router;
