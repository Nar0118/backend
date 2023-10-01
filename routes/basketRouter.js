const Router = require("express");
const router = new Router();
const BasketController = require("../controllers/BasketController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, BasketController.create);
router.get("/:id", authMiddleware, BasketController.getOne);
router.delete("/:id", authMiddleware, BasketController.remove);
router.put("/:id", authMiddleware, BasketController.update);

module.exports = router;
