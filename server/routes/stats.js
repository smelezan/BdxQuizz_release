const express = require("express");

const router = express.Router();

const statsCtrl = require("../controllers/stats");

router.get("/topPlayerOfCategory/:id", statsCtrl.getTopPlayerOfCategory);
router.get("/topPlayer", statsCtrl.getTopPlayer);
router.get("/mostPlayedCategories", statsCtrl.getMostPlayedCategories);
router.get("/successRatioByCategory", statsCtrl.getSuccessRatioByCategory)
router.get("/user", statsCtrl.getUserStats);
router.put("/user", statsCtrl.updateUserStats);
router.get("/:id", statsCtrl.getStatsByCategory);
router.put("/:id", statsCtrl.updateCategoryStats);

module.exports = router;
