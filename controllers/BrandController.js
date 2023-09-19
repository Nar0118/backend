const { Brand } = require("../models/models");

class BrandController {
  async create(req, res) {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    res.json(brand);
  }

  async getAll(_, res) {
    const brands = await Brand.findAll();
    res.json(brands);
  }

  async remove(req, res) {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await brand.destroy();

    return res.status(204).json({ message: "Brand removed successfully" });
  }
}

module.exports = new BrandController();
