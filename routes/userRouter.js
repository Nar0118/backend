const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')
const authCheck = require('../middleware/authMiddleware')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/auth',authCheck,  userController.check)

module.exports = router