const roomManagement = require('../utils/roomManagement');
const questionManagement = require('../utils/questionManagement');
const Room = require('../models/Room');
const User = require('../models/User');
const ws = require('../../ws');

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

exports.getRoomByRoomCode = (req, res) => {
  const roomCode = req.params.roomcode;

  Room.findOne({ roomCode }).then((room) => {
    if (room) {
      if (room.mode === 'ENDLESS') {
        res.status(400).json({
          title: 'error',
          message: "Can't join an Endless room",
        });
      } else {
        res.status(200).json({
          title: 'success',
          category: room.category,
          mode: room.mode,
        });
      }
    } else {
      res.status(400).json({
        title: 'error',
        message: "this room doesn't exist",
      });
    }
  });
};
exports.getNextQuestion = (req, res) => {
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
    }
  });
};

exports.getAnswer = (req, res) => {
  const { answer, roomCode } = req.body;
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
function disconnectUser(socket) {
  let currRoomCode = '';

  ws.forEach((room, roomcode) => {
    room.players.forEach((player, key) => {
      if (key === socket) {
        currRoomCode = roomcode;
      }
    });
  });
  const room = ws.get(currRoomCode);
  room.players.forEach((value, key) => {
    key.emit('disconnection', { id: room.players.get(socket) });
  });
  room.players.delete(socket);

  if (room.players.size === 0) {
    ws.delete(currRoomCode);
  }
}
async function nextQuestion(roomCode, isFirst) {
  const room = await Room.findOne({ roomCode });
  if (room !== undefined) {
    const question = await room.getNextQuestion(isFirst);
    if (question === undefined) {
      return { message: 'no question left' };
    }
    return questionManagement.parseQuestion(question);
  }
  return { message: 'This room doesnt exist' };
}

async function getCurrentAnswer(roomCode, answer) {
  const room = await Room.findOne({ roomCode });
  const correctAnswer = await room.getAnswer(answer);
  if (correctAnswer === answer) {
    return {
      isCorrect: true,
      correctAnswer,
    };
  }
  return {
    isCorrect: false,
    correctAnswer,
  };
}
const allAreReady = (room) => {
  let totalReady = 0;
  room.players.forEach((value) => {
    if (value.ready) {
      totalReady += 1;
    }
  });
  return totalReady === room.players.size;
};
function updateReadyState(roomcode, socket, ready) {
  const room = ws.get(roomcode);

  const { id } = room.players.get(socket);
  room.players.set(socket, { id, ready });
}

module.exports.respond = (socket) => {
  socket.on('start', async (params) => {
    const question = await nextQuestion(params.roomcode, true);
    updateReadyState(params.roomcode, socket, true);
    const room = ws.get(params.roomcode);

    if (allAreReady(room)) {
      room.players.forEach((value, key) => {
        key.emit('question', { ...question });
        value.ready = false;
      });
    }
  });

  socket.on('answer', async (params) => {
    const answer = await getCurrentAnswer(params.roomcode, params.answer);
    updateReadyState(params.roomcode, socket, true);
    let room = ws.get(params.roomcode);
    if (params.mode === 'ZEN') {
      if (allAreReady(room)) {
        room.players.forEach((value, key) => {
          key.emit('answer', answer);
          value.ready = false;
        });
        setTimeout(async () => {
          const question = await nextQuestion(params.roomcode, false);
          room = ws.get(params.roomcode);
          room.players.forEach((value, key) => {
            key.emit('question', { ...question });
            value.ready = false;
          });
        }, 2000);
      }
    } else {
      room.players.forEach((value, key) => {
        if (!answer.isCorrect) {
          if (key === socket) key.emit('answer', answer);
          else
            key.emit('answer', {
              isCorrect: true,
              correctAnswer: answer.correctAnswer,
            });
        } else if (key === socket) {
          key.emit('answer', answer);
        } else {
          key.emit('answer', {
            isCorrect: false,
            correctAnswer: answer.correctAnswer,
          });
        }

        value.ready = false;
      });
      setTimeout(async () => {
        const question = await nextQuestion(params.roomcode, false);
        room = ws.get(params.roomcode);
        room.players.forEach((value, key) => {
          key.emit('question', { ...question });
          value.ready = false;
        });
      }, 2000);
    }
  });

  socket.on('join-room', async (params) => {
    const room = ws.get(params.roomCode);
    let playersUsernames = [];
    const promises = [];
    room.players.forEach((value) => {
      promises.push(
        new Promise((resolve, reject) => {
          User.findById(value.id).then((user) => {
            if (user !== undefined) {
              resolve(user.username);
            } else {
              reject();
            }
          });
        })
      );
    });
    Promise.all(promises).then((usernames) => {
      playersUsernames = usernames;
      room.players.forEach((_, key) => {
        key.emit('join', { playersUsernames });
      });
    });
  });

  socket.on('end', (params) => {
    const { results, roomCode } = params;
    const room = ws.get(roomCode);

    const { id } = room.players.get(socket);
    const finalResult = results.correct;
    room.players.forEach((value, key) => {
      key.emit('end', { results: finalResult, player: id });
      value.ready = false;
    });
  });
  socket.on('disconnect', () => {
    disconnectUser(socket);
  });
};
