const { Order, OrderDevice, Basket } = require("../models/models");

class OrderController {
  async create(req, res) {
    const { userId, subtotal, deviceIds } = req;
    const order = await Order.create({ userId, price: subtotal });

    deviceIds.map(async (deviceId) => {
      await OrderDevice.create({ deviceId, orderId: order.id });
    });

    await Basket.destroy({
      where: {
        userId,
      },
    });

    res.json(req);
  }

  async getAll(req, res) {
    const types = await Order.findAll();
    res.json(types);
  }
}

module.exports = new OrderController();
