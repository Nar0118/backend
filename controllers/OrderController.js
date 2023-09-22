const { Order, OrderDevice, Basket } = require("../models/models");

class OrderController {
  async create(req, res) {
    const {
      userId,
      deviceIds,
      price,
      address,
      email,
      firstName,
      lastName,
      paymentMethod,
      phone,
    } = req.body;

    const order = await Order.create({
      userId,
      price,
      address,
      phone,
      email,
      last_name: lastName,
      first_name: firstName,
      payment_method: paymentMethod,
    });

    deviceIds?.forEach(async (deviceId) => {
      await OrderDevice.create({ deviceId, orderId: order.id });
    });

    await Basket.destroy({
      where: {
        userId,
      },
    });

    res.status(201).json({ message: "Order has been successfully created!" });
  }

  async getAll(req, res) {
    const types = await Order.findAll();
    res.json(types);
  }

  async getOne(req, res) {
    const { id } = req.user;
    const orders = await Order.findAll({
      where: { userId: id },
    });

    res.json(orders);
  }
}

module.exports = new OrderController();
