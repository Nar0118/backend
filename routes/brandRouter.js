const Router = require('express')
const router = new Router()
const brandController = require('../controllers/BrandController')

router.post('/', brandController.create);
router.get('/', brandController.getAll)
router.delete("/:id", brandController.remove);

module.exports = router