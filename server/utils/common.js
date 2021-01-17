function arrayRemove(arr, value) {
    return arr.filter((element) => {
        return element.username != value;
    });
}

module.exports = {
    arrayRemove,
}