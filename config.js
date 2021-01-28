require('dotenv').config();

let DB = '';
if (process.env.NODE_ENV === 'test') {
  const mongoAddress = process.env.MONGO_ADDRESS || 'localhost';
  DB = `mongodb://${mongoAddress}:27017/test-bdx-quizz`;
} else if (process.env.NODE_ENV === 'production') {
  DB = process.env.COSMO_ADDRESS;
} else {
  const mongoAddress = process.env.MONGO_ADDRESS || 'localhost';
  DB = `mongodb://${mongoAddress}:27017/bdx-quizz-db`;
}
module.exports = {
  DB,
};
