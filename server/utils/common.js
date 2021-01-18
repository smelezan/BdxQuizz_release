function arrayRemove(arr, value) {
  return arr.filter((element) => element.username !== value);
}

module.exports = {
  arrayRemove,
};
