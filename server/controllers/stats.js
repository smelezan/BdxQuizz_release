const Category = require("../models/Category");
const User = require("../models/User");
const { find } = require("../models/User");

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

exports.updateUserStats = (req, res) => {
    username = req.params.id;
    categoryName = req.body.category;
    User.updateOne({ username },
        {
            '$inc': {
                ["stats.nbQuizzWon"]: req.body.nbQuizzWon,
                ["stats.nbQuizzLost"]: req.body.nbQuizzLost,
                ["stats.category." + categoryName + ".nbQuizzWon"]: req.body.nbQuizzWon,
            },
            '$set': {
                ["stats.category." + categoryName + ".bestScore"]: req.body.bestScore,
                ["stats.category." + categoryName + ".averageScore"]: req.body.averageScore,
                ["stats.category." + categoryName + ".nbQuizzWon"]: req.body.nbQuizzWon,
                ["stats.category." + categoryName + ".nbQuizzLost"]: req.body.nbQuizzLost,
            }

        }, (err, result) => {
            res.status(200).json({ message: "Updated", result: result });
        })
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
    newCategoryId = req.params.id;
    Category.updateOne({ categoryId: newCategoryId },
        {
            '$inc': {
                'stats.totalPlayed': 1,
                'stats.nbGoodAnswers': req.body.nbGoodAnswers,
                'stats.nbBadAnswers': req.body.nbBadAnswers
            }
        }, (err, result) => {
            res.status(200).json({ message: "Updated", result: result });
        })
    Category.find({}).then(categories => {
        categories.map(category => {
            category.getSuccessRatio();
        })
    })
}