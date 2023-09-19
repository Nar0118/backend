const Router = require("express");
const router = new Router();
const BasketController = require("../controllers/BasketController");

router.post("/", BasketController.create);
router.get("/:id", BasketController.getOne);
router.delete("/:id", BasketController.remove);

module.exports = router;
