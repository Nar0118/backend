const { Order, OrderDevice, Basket, Device } = require("../models/models");

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
      status: "pending",
    });

    for (let deviceId in deviceIds) {
      await OrderDevice.create({
        deviceId,
        orderId: order.id,
        count: deviceIds[deviceId],
      });
    }

    await Basket.destroy({
      where: {
        userId,
      },
    });

    res.status(201).json({ message: "Order has been successfully created!" });
  }

  async getOne(req, res) {
    const { id } = +req.params;

    res.json(id);
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;

      const orders = await Order.findByPk(id, {
        include: Device,
        order: [["createdAt", "DESC"]],
      });

      if (!orders) {
        return res.status(404).json({ message: "Order doesn't exist" });
      }

      res.status(200).json(orders);
    } catch {
      res.status(400).json({ message: "Something went wrong" });
    }
  }

  async getAll(req, res) {
    const { id } = req.user;
    const orders = await Order.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
    });

    res.json(orders);
  }
}

module.exports = new OrderController();
