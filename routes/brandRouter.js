const Router = require('express')
const router = new Router()
const brandController = require('../controllers/BrandController')
const authMiddleware = require("../middleware/authMiddleware");

router.post('/', authMiddleware, brandController.create);
router.get('/', brandController.getAll)
router.delete("/:id", authMiddleware, brandController.remove);

module.exports = router