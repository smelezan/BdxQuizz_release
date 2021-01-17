require('dotenv').config();

// const mongoAddress = process.env.DB_ADDRESS || 'localhost';
// const mongoPORT = process.env.DB_PORT || 27017;
let DB = '';
if (process.env.NODE_ENV === 'production') {
  DB =
    'mongodb://bdxquizz-db:CZQA7XY07DXxZb1cjViBn1UaUeQjNbdV1NFD9BIN6AZPVIqW4rekh385vQumZIBc8twUObz5LzxIIq9jKTglvw%3D%3D@bdxquizz-db.mongo.cosmos.azure.com:10255/?ssl=true&appName=@bdxquizz-db@';
} else if (process.env.MONGO_ADDRESS) {
  DB = `mongodb://${process.env.MONGO_ADDRESS}:27017/bdx-quizz-db`;
} else {
  DB = 'mongodb://localhost:27017/bdx-quizz-db';
}
module.exports = {
  DB,
};
