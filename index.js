const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB = `mongodb://${process.env.DB_ADDRESS}:${process.env.DB_PORT}/bdx-quizz-db`;
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const connection = mongoose.createConnection(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
  })
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: /.*/,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
const categoriesRoute = require('./server/routes/categories');

http.listen(PORT);
// socket io
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use(express.static('./client/bdxquizz-front/dist'));
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: `${__dirname}/client/yt-sharing-front/dist/`,
  });
});

app.use('/categories/', categoriesRoute);
