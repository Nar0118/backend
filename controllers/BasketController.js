const { Basket, Device } = require("../models/models");

class BasketController {
  async create(req, res) {
    const { userId, deviceId, quantity } = req.body;
    const findBasket = await Basket.findOne({
      where: { userId, deviceId },
    });
    let basket;
    if (!findBasket) {
      basket = await Basket.create({ userId, deviceId, quantity });
    } else {
      basket = await Basket.update(
        { quantity: quantity + findBasket.quantity },
        {
          where: { userId, deviceId },
        }
      );
    }

    res.json(basket);
  }

  async getOne(req, res) {
    const userId = +req.params.id;
    const basket = await Basket.findAll({
      where: { userId },
      include: [
        {
          model: Device,
        },
      ],
    });

    res.json(basket);
  }

  async remove(req, res) {
    const { id } = req.params;
    const basket = await Basket.findByPk(id);

    if (!basket) {
      return res.status(404).json({ message: "Basket not found" });
    }

    await basket.destroy();

    res.status(204).send({ message: "Basket removed successfully" });
  }
}

module.exports = new BasketController();
