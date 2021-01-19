const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
  });
  newUser
    .save()
    .then(() => {
      const token = jwt.sign({ userId: newUser._id }, 'secret_key');
      res.status(200).json({
        title: 'success',
        userId: newUser._id,
        token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: 'username in use',
      });
    });
};

exports.login = (req, res) => {
  const userCheck = {
    username: req.body.username,
    password: req.body.password,
  };
  console.log(req.body);
  User.findOne({ username: userCheck.username }, (err, user) => {
    if (err)
      return res.status(500).json({
        title: 'server error',
        error: err,
      });
    if (!user) {
      return res.status(401).json({
        title: 'user not found',
      });
    }
    if (!bcrypt.compareSync(userCheck.password, user.password)) {
      return res.status(401).json({
        title: ' login failed',
      });
    }
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    return res.status(200).json({
      title: 'login success',
      token,
      userId: user._id,
    });
  });
};
