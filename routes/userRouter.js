const Router = require('express')
const router = new Router()
const userController = require('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/auth',authMiddleware,  userController.check)
router.put('/',authMiddleware,  userController.update)

module.exports = router