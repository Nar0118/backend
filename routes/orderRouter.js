const Router = require("express");
const router = new Router();
const OrderController = require("../controllers/OrderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, OrderController.create);
router.get("/", authMiddleware, OrderController.getAll);
router.get("/:id", authMiddleware, OrderController.getOne);

module.exports = router;
