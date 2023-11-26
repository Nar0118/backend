const { Order, OrderDevice, Basket, Device } = require("../models/models");
const onlinePayment = require("../ameriaPayment");

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
      backURL,
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

    let payment = {};

    if (paymentMethod === "card") {
      const paymentData = {
        ClientID: 1,
        Username: `${firstName} ${lastName}`,
        // Password: password,
        BackURL: backURL,
        // Currency: currency || "AMD",
        OrderID: order.id,
        Amount: price,
        CardHolderID: "cardHolderID",
        Opaque: "opaque",
      };

      payment = await onlinePayment(paymentData);

      if (!payment) {
        return res.status(400).json({ message: "Something went wrong!" });
      }

      // res.status(201).json(payment);
    }

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

    res
      .status(201)
      .json({ message: "Order has been successfully created!", response: payment });
  }

  async getOne(req, res) {
    try {
      const { id } = req.user;

      const orders = await Order.findAll({
        where: { userId: id },
        include: Device,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(orders);
    } catch {
      res.status(400).json({ message: "Something went wrong" });
    }
  }

  async getAll(_, res) {
    try {
      const orders = await Order.findAll({
        include: Device,
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(orders);
    } catch {
      res.status(400).json({ message: "Something went wrong" });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      await order.update({ status });

      return res.json(order);
    } catch (error) {
      return res.status(500).json({ error: "Error updating order status" });
    }
  }

  async remove(req, res) {
    const { id } = req.params;
    const brand = await Order.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Order not found" });
    }

    await brand.destroy();

    return res.status(204).json({ message: "Order removed successfully" });
  }
}

module.exports = new OrderController();
