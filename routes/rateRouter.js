const Router = require('express')
const router = new Router()
const rateController = require('../controllers/RateController')

router.post('/', rateController.create);
router.get('/', rateController.getAll);

module.exports = router