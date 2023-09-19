const { Rating } = require("../models/models");

class RateController {
  async create(req, res) {
    const { userId, deviceId, rate, comment } = req.body;
    const rating = await Rating.create({ userId, deviceId, rate, comment });
      
    res.json(rating);
  }

  async getAll(req, res) {
    const rate = await Rating.findAll();
    res.json(rate);
  }
}

module.exports = new RateController();
