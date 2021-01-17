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

exports.getStats = (req, res) => {
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
          title: 'user stats',
          user: {
            stats: user.stats,
          },
        });
    });
  });
};

exports.getNotifications = (req, res) => {
  username = req.params.id;
  Users.findOne({ username }).then(user => {
    notification = user.notifications;
    res.status(200).json({ notification })
  });
}

exports.sendFriendRequest = (req, res) => {
  username = req.params.id;
  SenderUsername = req.session.username;
  Users.findOne({ username }).then(user => {
    user.notifications.friends.push({ SenderUsername });
    user.save();
    res.status(200).json({ message: "Friend request sent" })
  })
}

exports.cancelFriendRequest = (req, res) => {
  username = req.params.id;
  SenderUsername = req.session.username;
  Users.findOne({ username }).then(user => {
    let updatedFriendNotifications = common.arrayRemove(user.notifications.friends, SenderUsername);
    user.notifications.friends = updatedFriendNotifications;
    user.save();
    res.status(200).json({ message: "Friend request cancel" });
  })
}

exports.acceptFriendRequest = (req, res) => {
  friend = req.params.id;
  username = req.session.username
  Users.findOne({ username }).then(user => {
    user.friendList.push(friend);
    let updatedFriendNotifications = common.arrayRemove(user.notifications.friends, friend);
    user.notifications.friends = updatedFriendNotifications;
    user.save();
    res.status(200).json({ message: "Friend added" });
  })
}

exports.sendPlayingInvitation = (req, res) => {
  username = req.params.id;
  roomCode = req.body.roomCode
  challengerUsername = req.session.username;
  Users.findOne({ username }).then(user => {
    user.notifications.games.push({ "username": challengerUsername, "roomCode": roomCode });
    user.save();
    res.status(200).json({ user })
  });
}

exports.cancelPlayingInvitation = (req, res) => {
  username = req.params.id;
  challengerUsername = req.session.username;
  Users.findOne({ username }).then(user => {
    let remainingGames = common.arrayRemove(user.notifications.games, challengerUsername);
    user.notifications.games = remainingGames;
    user.save();
    res.status(200).json({ remainingGames });
  })
}
