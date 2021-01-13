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

module.exports = {
  parseQuestion,
};
