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
            return res.status(200).json(user.stats);
        });
    });
}

exports.getStatsByCategory = (req, res) => {
    categoryId = req.params.id;
    Category.findOne({ categoryId }).then(categorie => {
        stats = categorie.stats;
        res.status(200).json({ stats })
    });
};

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
    console.log("TIME" + req.body.time);
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err)
            return res.status(401).json({
                title: 'unauthorized',
            });
        categoryName = req.body.category;
        User.updateOne({ '_id': new mongodb.ObjectID(decoded.userId) },
            {
                '$inc': {
                    ["stats.category." + categoryName + ".nbQuizzPlayed"]: 1,
                },

            }, async (err, result) => {
                User.findById(decoded.userId).then(async user => {
                    await user.updateNumberOfQuizzPlayed();
                    user.updateBestScore(req.body.score);
                }, (err, result) => { })
            });

    });
}
exports.updateUserStats = async (req, res) => {
    console.log("TIME" + req.body.time);
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err)
            return res.status(401).json({
                title: 'unauthorized',
            });
        categoryName = req.body.category;
        User.updateOne({ '_id': new mongodb.ObjectID(decoded.userId) },
            {
                '$inc': {
                    'stats.nbQuizzWon': req.body.nbQuizzWon,
                    'stats.nbQuizzLost': req.body.nbQuizzLost,
                    ["stats.category." + categoryName + ".nbQuizzWon"]: req.body.nbQuizzWon,
                    ["stats.category." + categoryName + ".nbQuizzLost"]: req.body.nbQuizzLost,
                    ["stats.category." + categoryName + ".nbQuizzPlayed"]: 1,
                },
            }, (err, result) => {
                User.findById(decoded.userId).then(async user => {
                    if (user.stats.category[categoryName].bestScore == undefined) {
                        User.updateOne({ '_id': new mongodb.ObjectID(decoded.userId) },
                            {
                                '$set': {
                                    ["stats.category." + categoryName + ".bestScore"]: req.body.score,
                                    ["stats.category." + categoryName + ".averageScore"]: req.body.score,
                                    ["stats.category." + categoryName + ".bestTime"]: req.body.time,
                                    ["stats.category." + categoryName + ".averageTime"]: req.body.time,
                                }
                            }, (err, result) => {
                                console.log("ERR0" + err);
                            })
                    }
                    else {
                        let newTime = req.body.time.split(":");
                        let oldAverageTime = user.stats.category[categoryName].averageTime.split(":");
                        let averageMin = common.addToAverage(user, parseInt(oldAverageTime[0]), parseInt(newTime[0]), categoryName);
                        let averageSeconde = common.addToAverage(user, parseInt(oldAverageTime[1]), parseInt(newTime[1]), categoryName);
                        this.averageTime = averageMin + ":" + averageSeconde;
                        this.averageScore = common.addToAverage(user, user.stats.category[categoryName].averageScore, req.body.score, categoryName);

                        let res = statsManagement.bestTimeAndScore(req, user, categoryName);
                        this.bestScore = res[0];
                        this.time = res[1];

                        User.updateOne({ '_id': new mongodb.ObjectID(decoded.userId) },
                            {
                                '$set': {
                                    ["stats.category." + categoryName + ".bestScore"]: this.bestScore,
                                    ["stats.category." + categoryName + ".averageScore"]: this.averageScore,
                                    ["stats.category." + categoryName + ".bestTime"]: this.time,
                                    ["stats.category." + categoryName + ".averageTime"]: this.averageTime,
                                }
                            }, (err, result) => {
                                console.log("ERR1" + err);
                            })
                    }
                    await user.updateNumberOfQuizzPlayed();
                    await user.updateBestScore(req.body.score, req.body.time);
                    await user.updateAverageTime(req.body.time);
                    user.updateAverageScore(req.body.score);
                })
            })
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
    categoryName = req.params.id;
    Category.updateOne({ name: categoryName },
        {
            '$inc': {
                'stats.totalPlayed': 1,
                'stats.nbGoodAnswers': req.body.nbGoodAnswers,
                'stats.nbBadAnswers': req.body.nbBadAnswers
            }
        }, (err, result) => {
            res.status(200).json({ message: "Updated", result: result });
        })
    Category.findOne({ name: categoryName }).then(category => {
        category.updateSuccessRatio();
    })
}
