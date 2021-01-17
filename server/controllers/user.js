/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'secret_key', (err, decoded) => {
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
exports.getNotifications = (req, res) => {
  const username = req.params.id;
  User.findOne({ username }).then((user) => {
    const notification = user.notifications;
    res.status(200).json({ notification });
  });
};

exports.sendFriendRequest = (req, res) => {
  const username = req.params.id;
  const SenderUsername = req.session.username;
  User.findOne({ username }).then((user) => {
    user.notifications.friends.push({ SenderUsername });
    user.save();
    res.status(200).json({ message: 'Friend request sent' });
  });
};

exports.cancelFriendRequest = (req, res) => {
  const username = req.params.id;
  const SenderUsername = req.session.username;
  User.findOne({ username }).then((user) => {
    const updatedFriendNotifications = common.arrayRemove(
      user.notifications.friends,
      SenderUsername
    );
    user.notifications.friends = updatedFriendNotifications;
    user.save();
    res.status(200).json({ message: 'Friend request cancel' });
  });
};

exports.acceptFriendRequest = (req, res) => {
  const friend = req.params.id;
  const { username } = req.session;
  User.findOne({ username }).then((user) => {
    user.friendList.push(friend);
    const updatedFriendNotifications = common.arrayRemove(
      user.notifications.friends,
      friend
    );
    user.notifications.friends = updatedFriendNotifications;
    user.save();
    res.status(200).json({ message: 'Friend added' });
  });
};

exports.sendPlayingInvitation = (req, res) => {
  const username = req.params.id;
  const { roomCode } = req.body;
  const challengerUsername = req.session.username;
  User.findOne({ username }).then((user) => {
    user.notifications.games.push({
      username: challengerUsername,
      roomCode,
    });
    user.save();
    res.status(200).json({ user });
  });
};

exports.cancelPlayingInvitation = (req, res) => {
  const username = req.params.id;
  const challengerUsername = req.session.username;
  User.findOne({ username }).then((user) => {
    const remainingGames = common.arrayRemove(
      user.notifications.games,
      challengerUsername
    );
    user.notifications.games = remainingGames;
    user.save();
    res.status(200).json({ remainingGames });
  });
};
