const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const history = require('connect-history-api-fallback');

require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: /.*/,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
const config = require('./config');

const categoriesRoute = require('./server/routes/categories');
const authRoute = require('./server/routes/auth');
const userRoute = require('./server/routes/user');
const roomRoute = require('./server/routes/room');
const roomCtrl = require('./server/controllers/room');

const PORT = process.env.PORT || 4000;
console.log(config.DB);
mongoose
  .connect(config.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: false,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

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

const ws = require('./ws');
const tokenManagement = require('./server/utils/tokenManagement');

http.listen(PORT);
// socket io
io.use(async (socket, next) => {
  const { roomcode, token } = socket.handshake.query;
  if (ws.has(roomcode)) {
    const roomCodeInfos = ws.get(roomcode);
    const id = await tokenManagement.extractIdFromToken(token);
    roomCodeInfos.players.set(socket, { id, ready: false });

    ws.set(roomcode, { ...roomCodeInfos });
  } else {
    const map = new Map();
    const id = await tokenManagement.extractIdFromToken(token);
    map.set(socket, { id, ready: false });
    ws.set(roomcode, {
      players: map,
    });
  }
  return next();
});

io.on('connection', roomCtrl.respond);
app.use(history({ index: 'index.html' }));

app.use(express.static('./client/bdxquizz-front/dist'));
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: `${__dirname}/client/bdxquizz-front/dist/`,
  });
});

app.use('/api/categories/', categoriesRoute);
app.use('/api/auth/', authRoute);
app.use('/api/user/', userRoute);
app.use('/api/room/', roomRoute);
