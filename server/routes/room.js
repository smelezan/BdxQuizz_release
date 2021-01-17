const express = require('express');
const roomCtrl = require('../controllers/room');
const middleware = require('../middlewares/authentifications');

const router = express.Router();
router.get('/:roomcode', middleware.isAuthentified, roomCtrl.getRoomByRoomCode);
router.post('/answer', roomCtrl.getAnswer);
router.put('/question', roomCtrl.getNextQuestion);
router.post('/', middleware.isAuthentified, roomCtrl.createRoom);
module.exports = router;
