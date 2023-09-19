const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const deviceRouter = require('./deviceRouter')
const basketRouter = require('./basketRouter')
const rateRouter = require('./rateRouter')
const orderRouter = require('./orderRouter')
const stripeRouter = require('../stripe');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/rate', rateRouter);
router.use('/order', orderRouter);
router.use('/stripe', stripeRouter);

module.exports = router