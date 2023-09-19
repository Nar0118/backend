const Router = require('express')
const router = new Router()
const OrderController = require('../controllers/OrderController')

router.post('/', OrderController.create);
router.get('/', OrderController.getAll);

module.exports = router