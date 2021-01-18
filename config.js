require('dotenv').config();

let DB = '';
if (process.env.NODE_ENV === 'test') {
  const mongoAddress = process.env.MONGO_ADDRESS || 'localhost';
  DB = `mongodb://${mongoAddress}:27017/test-bdx-quizz`;
} else if (process.env.NODE_ENV === 'production') {
  DB =
    'mongodb://bdxquizz-db:CZQA7XY07DXxZb1cjViBn1UaUeQjNbdV1NFD9BIN6AZPVIqW4rekh385vQumZIBc8twUObz5LzxIIq9jKTglvw%3D%3D@bdxquizz-db.mongo.cosmos.azure.com:10255/?ssl=true&appName=@bdxquizz-db@';
} else {
  const mongoAddress = process.env.MONGO_ADDRESS || 'localhost';
  DB = `mongodb://${mongoAddress}:27017/bdx-quizz-db`;
}
module.exports = {
  DB,
};
