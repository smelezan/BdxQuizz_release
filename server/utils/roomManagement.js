const Room = require('../models/Room');
const questionManagement = require('./questionManagement');

const randomLetter = () =>
  String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));

const isRoomCodeAlreadyExist = (roomCode) => {
  Room.find({ roomCode }).then((roomFound) => roomFound !== undefined);
};
const generateRoomCode = async () => {
  let roomCode = '';
  for (let i = 0; i < 8; i += 1) {
    roomCode += randomLetter();
  }
  const isExisting = await isRoomCodeAlreadyExist(roomCode);

  if (isExisting) {
    return generateRoomCode();
  }
  return roomCode;
};

const createRoom = (params) =>
  new Promise((resolve) => {
    generateRoomCode().then((roomCode) => {
      questionManagement
        .getQuestions(params.nbQuestions, params.category, params.difficulty)
        .then((questions) => {
          const newRoom = {};
          newRoom.roomCode = roomCode;

          newRoom.nbQuestions = params.nbQuestions;
          newRoom.questions = questions;
          newRoom.host = params.host;
          newRoom.mode = params.mode;
          newRoom.category = params.category;
          newRoom.difficulty = params.difficulty;

          resolve(newRoom);
        });
    });
  });

module.exports = {
  createRoom,
};
