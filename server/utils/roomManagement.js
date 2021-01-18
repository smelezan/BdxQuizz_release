const axios = require('axios');
const he = require('he');
const Room = require('../models/Room');
const Category = require('../models/Category');

const url = (nbQuestions, category, difficulty) =>
  `https://opentdb.com/api.php?amount=${nbQuestions}&category=${category}&difficulty=${difficulty}`;
const regex = new RegExp('(.+\\s*)(:\\s*)(.+)');

const parseCategoryName = (categoryName) => categoryName.replace(regex, '$3');

const parseCategories = (questions) => {
  for (let i = 0; i < questions.size; i += 1) {
    questions[i].category = parseCategoryName(questions[i].category);
  }
  return questions;
};
const randomLetter = () =>
  String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));

const getQuestions = async (
  numberOfQuestions = 10,
  category = 0,
  difficulty = 'medium'
) => {
  const categoryResponse = await Category.findOne({ name: category });
  if (difficulty === 'any') {
    difficulty = '';
  }
  console.log(url(numberOfQuestions, categoryResponse.categoryId, difficulty));
  const response = await axios.get(
    url(numberOfQuestions, categoryResponse.categoryId, difficulty)
  );
  let questions = response.data.results;
  questions = parseCategories(questions);
  const decodedQuestions = questions.map((question) => {
    const result = { ...question };
    result.question = he.decode(result.question);
    result.correct_answer = he.decode(result.correct_answer);
    result.incorrect_answers = result.incorrect_answers.map((answer) =>
      he.decode(answer)
    );
    return result;
  });
  return decodedQuestions;
};

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
      getQuestions(params.nbQuestions, params.category, params.difficulty).then(
        (questions) => {
          const newRoom = {};
          newRoom.roomCode = roomCode;
          newRoom.nbQuestions = params.nbQuestions;
          newRoom.questions = questions;
          newRoom.host = params.host;
          newRoom.mode = params.mode;
          newRoom.category = params.category;
          newRoom.difficulty = params.difficulty;
          resolve(newRoom);
        }
      );
    });
  });

const getNextQuestionEndless = async (params) => {
  const questions = await getQuestions(10, params.category, params.difficulty);
  return questions;
};
module.exports = {
  createRoom,
  getNextQuestionEndless,
};
