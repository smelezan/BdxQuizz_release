const Category = require("../models/Category");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const mongodb = require('mongodb');
const statsManagement = require('../utils/statsManagement');
const common = require('../utils/common');
const { find } = require("../models/User");


exports.getUserStats = (req, res) => {
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
            return res.status(200).json(user);
        });
    });
}

exports.getTopPlayerOfCategory = (req, res) => {
    category = req.params.id;
    User.findOne({ ["stats.category." + category]: { $exists: true } }, (err, user) => {
        if (user) {
            User.find({}).sort({ ["stats." + category]: -1 }).exec(function (err, descendingOrder) {
                res.status(200).json({ descendingOrder });
            })
        }
        else {
            res.status(400).json({ message: "Category doesn't exist or never played" });
        }
    });
}

exports.getTopPlayer = (req, res) => {
    User.find({}).sort({ "stats.nbQuizzWon": -1 }).exec(function (err, descendingOrder) {
        res.status(200).json({ descendingOrder });
    })
}

exports.updateUserEndlessStats = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const score = req.body.score;
    jwt.verify(token, 'secret_key', async (err, decoded) => {
        if (err)
            return res.status(401).json({
                title: 'unauthorized',
            });
        categoryName = req.body.category;
        await User.updateOne({ '_id': decoded.userId },
            {
                '$inc': {
                    'stats.nbQuizzPlayed': 1,
                    ["stats.category." + categoryName + ".nbQuizzPlayed"]: 1,
                },
                '$max': {
                    'stats.bestScore': score,
                    ['stats.category.' + categoryName + ".bestScore"]: score
                },
            });
        User.findById(decoded.userId).then(async user => {
            return res.status(200).json(user.stats);
        });

    });
}
exports.updateUserStats = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const nbWon = req.body.nbQuizzWon;
    const nbLost = req.body.nbQuizzLost;
    const score = req.body.score;
    const time = req.body.time;

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err)
            return res.status(401).json({
                title: 'unauthorized',
            });
        categoryName = req.body.category;

        User.findById(decoded.userId).then(async user => {
            const timeValue = getValueTime(time);

            let averageScore = score;
            let averageTime = timeValue;
            if (user.stats.nbQuizzPlayed != 0) {
                averageScore = (user.stats.averageScore * (user.stats.nbQuizzPlayed) + score) / (user.stats.nbQuizzPlayed + 1);
                averageTime = (user.stats.averageTime * (user.stats.nbQuizzPlayed) + timeValue) / (user.stats.nbQuizzPlayed + 1);
            }

            let averageCatScore = score;
            let averageCatTime = timeValue;
            if (user.stats.category[categoryName]) {
                averageCatScore = (user.stats.category[categoryName].averageScore * (user.stats.category[categoryName].nbQuizzPlayed) + score) / (user.stats.category[categoryName].nbQuizzPlayed + 1);
                averageCatTime = (user.stats.category[categoryName].averageTime * (user.stats.category[categoryName].nbQuizzPlayed) + timeValue) / (user.stats.category[categoryName].nbQuizzPlayed + 1);
            }

            await User.updateOne({ '_id': decoded.userId },
                {
                    '$inc': {
                        'stats.nbQuizzWon': nbWon,
                        'stats.nbQuizzLost': nbLost,
                        'stats.nbQuizzPlayed': 1,

                        ["stats.category." + categoryName + ".nbQuizzWon"]: nbWon,
                        ["stats.category." + categoryName + ".nbQuizzLost"]: nbLost,
                        ["stats.category." + categoryName + ".nbQuizzPlayed"]: 1,
                    },
                    '$push': {
                        'stats.scores': score,
                        'stats.times': timeValue
                    },
                    '$max': {
                        'stats.bestScore': score,
                        ['stats.category.' + categoryName + ".bestScore"]: score
                    },
                    '$min': {
                        'stats.bestTime': timeValue,
                        ['stats.category.' + categoryName + ".bestTime"]: timeValue
                    },
                    '$set': {
                        'stats.averageScore': averageScore,
                        'stats.averageTime': averageTime,
                        ['stats.category.' + categoryName + ".averageScore"]: averageCatScore,
                        ['stats.category.' + categoryName + ".averageTime"]: averageCatTime
                    }
                });
            return res.status(200).json(user.stats);
        });
    });
}

exports.getMostPlayedCategories = (req, res) => {
    Category.find({}).sort({ "stats.totalPlayed": -1 }).exec(function (err, descendingOrder) {
        res.status(200).json({ descendingOrder });
    })
}

exports.getSuccessRatioByCategory = (req, res) => {
    Category.find({}).sort({ "stats.successRatio": -1 }).exec(function (err, descendingOrder) {
        res.status(200).json({ descendingOrder });
    })
}

exports.updateCategoryStats = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err)
            return res.status(401).json({ title: 'unauthorized' });

        categoryName = req.body.category;
        User.findById(decoded.userId).then(async user => {
            Category.findOne({ name: categoryName }).then(category => {
                category.updateBestPlayer(user.username, req.body.score);
                return res.status(200).json({ message: "Updated"});
            });
        });
    });
}

function getValueTime(time) {
    let splitTime = time.split(":");
    return parseFloat(splitTime[0]) * 60 + parseFloat(splitTime[1]);
}
