function arrayRemove(arr, value) {
  return arr.filter((element) => element.username !== value);
}

function addToAverage(user, average, newValue, categoryName) {
  return (
    (average * (user.stats.category[categoryName].nbQuizzPlayed - 1) +
      newValue) /
    user.stats.category[categoryName].nbQuizzPlayed
  );
}

module.exports = {
  arrayRemove,
  addToAverage,
};
