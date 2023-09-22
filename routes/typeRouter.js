const Router = require("express");
const router = new Router();
const typeController = require("../controllers/TypeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, typeController.create);
router.get("/", typeController.getAll);
router.delete("/:id", authMiddleware, typeController.remove);

module.exports = router;
