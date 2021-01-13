/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({
        title: 'unauthorized',
      });
    User.findById(decoded.userId, (error, user) => {
      if (error || !user)
        return res.status(401).json({
          title: 'unauthorized',
        });
      return res.status(200).json({
        title: 'user grabbed',
        user: {
          username: user.username,
        },
      });
    });
  });
};
