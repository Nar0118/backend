const Router = require("express");
const router = new Router();
const rateController = require("../controllers/RateController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, rateController.create);
router.get("/", authMiddleware, rateController.getAll);

module.exports = router;
