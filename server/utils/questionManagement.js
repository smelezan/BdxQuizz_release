const axios = require('axios');
const he = require('he');
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
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter -= 1;

    // And swap the last element with it
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
const parseQuestion = (question) => {
  const result = {};
  result.question = question.question;
  result.type = question.type;
  result.difficulty = question.difficulty;
  result.category = question.category;
  result.propositions = shuffle([
    question.correct_answer,
    ...question.incorrect_answers,
  ]);
  return result;
};

const getQuestions = async (
  numberOfQuestions = 10,
  category = 'Ultimate',
  difficulty = 'medium'
) => {
  const categoryResponse = await Category.findOne({ name: category });
  if (difficulty === 'any') {
    difficulty = '';
  }
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
const getNextQuestionEndless = (params) =>
  new Promise((resolve) => {
    getQuestions(10, params.category, params.difficulty).then((questions) =>
      resolve(questions)
    );
  });
module.exports = {
  parseQuestion,
  getNextQuestionEndless,
  getQuestions,
};
