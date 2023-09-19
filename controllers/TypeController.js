const { Type } = require("../models/models");

class TypeController {
  async create(req, res) {
    const { name } = req.body;
    const type = await Type.create({ name });
    res.json(type);
  }

  async getAll(_, res) {
    const types = await Type.findAll();
    res.json(types);
  }

  async remove(req, res) {
    const { id } = req.params;
    const type = await Type.findByPk(id);

    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }

    await type.destroy();

    return res.status(204).json({ message: "Type removed successfully" });
  }
}

module.exports = new TypeController();
