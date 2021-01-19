function bestTimeAndScore(req, user, categoryName) {
    let newTime = req.body.time.split(":");
    let oldTime = user.stats.category[categoryName].bestTime.split(":");

    if (user.stats.category[categoryName].bestScore < req.body.score) {
        this.bestScore = req.body.score;
        this.time = req.body.time;
    }
    else if (user.stats.category[categoryName].bestScore == req.body.score) {
        this.bestScore = user.stats.category[categoryName].bestScore;
        if (newTime[0] < oldTime[0]) {
            this.time = req.body.time;
        }
        else if (newTime[0] == oldTime[0]) {
            if (newTime[1] < oldTime[1]) {
                this.time = req.body.time;
            }
            else {
                this.time = user.stats.category[categoryName].bestTime;
            }
        }
        else {
            this.time = user.stats.category[categoryName].bestTime;
        }
    }
    else {
        this.bestScore = user.stats.category[categoryName].bestScore;
        this.time = user.stats.category[categoryName].bestTime;
    }
    return [this.bestScore, this.time];

}
module.exports = {
    bestTimeAndScore,
};
