const Router = require("express");
const DeviceController = require("../controllers/DeviceController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, DeviceController.create);
router.get("/", DeviceController.getAll);
router.get("/:id", DeviceController.getOne);
router.delete("/:id", authMiddleware, DeviceController.remove);
router.put("/:id", authMiddleware, DeviceController.edit);

module.exports = router;
