const roomManagement = require('../utils/roomManagement');
const questionManagement = require('../utils/questionManagement');
const Room = require('../models/Room');
const User = require('../models/User');

exports.createRoom = async (req, res) => {
  const roomsParams = req.body;
  roomManagement
    .createRoom({
      host: roomsParams.host,
      mode: roomsParams.mode,
      category: roomsParams.category,
      difficulty: roomsParams.difficulty,
      nbQuestions: 10,
    })
    .then((room) => {
      User.findById(room.host, (err, user) => {
        new Room({
          mode: room.mode,
          players: [user],
          category: room.category,
          difficulty: room.difficulty,
          roomCode: room.roomCode,
          questions: room.questions,
          nbQuestions: room.nbQuestions,
        })
          .save()
          .then((roomSaved) => {
            res.status(200).json({
              title: 'room created',
              roomCode: roomSaved.roomCode,
            });
          });
      });
    });
};

exports.getNextQuestion = (req, res) => {
  console.log(req.body.roomCode);
  Room.findOne({ roomCode: req.body.roomCode }).then((room) => {
    if (room !== undefined) {
      room.getNextQuestion().then((question) => {
        if (question === undefined) {
          res.json({ message: 'no question left' });
        } else {
          const result = questionManagement.parseQuestion(question);
          res.json({ question: result });
        }
      });
    } else {
      res.status(400).json({ message: 'This room doesnt exist' });
      console.log(`La room ${req.body.roomCode} n'existe pas`);
    }
  });
};

exports.getAnswer = (req, res) => {
  const { answer, roomCode } = req.body;
  console.log(req.body);
  Room.findOne({ roomCode }).then(async (room) => {
    const correctAnswer = await room.getAnswer(answer);
    if (correctAnswer === answer) {
      return res.json({
        isCorrect: true,
        correctAnswer,
      });
    }
    return res.json({
      isCorrect: false,
      correctAnswer,
    });
  });
};
