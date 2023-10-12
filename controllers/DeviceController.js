const path = require("path");
const { Sequelize } = require("sequelize");
const ApiError = require("../error/ApiError");
const { Device, Rating, User, Type, Brand } = require("../models/models");

class DeviceController {
  async create(req, res, next) {
    try {
      const { name, price, brandId, typeId, description, img } = req.body;

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        description,
        img,
      });

      res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [
        {
          model: Type,
        },
        {
          model: Brand,
        },
        {
          model: Rating,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
      order: [[Rating, "id", "DESC"]],
    });

    res.json(device);
  }

  async getAll(req, res) {
    const { brandId, typeId, page, limit, search } = req.query;
    const offset = (page - 1) * limit;
    let devices;
    const whereCondition = {};
    if (search && search !== "undefined") {
      whereCondition.name = {
        [Sequelize.Op.iLike]: `%${search}%`,
      };
    }

    if (typeId && typeId !== "undefined") {
      whereCondition.typeId = typeId;
    }

    if (brandId && brandId !== "undefined") {
      whereCondition.brandId = brandId;
    }

    devices = await Device.findAll({
      include: [
        {
          model: Rating,
          required: false,
        },
      ],
      limit: limit || 10,
      offset: offset || 0,
      order: [["createdAt", "DESC"]],
      where: whereCondition,
    });

    res.json(devices);
  }

  async remove(req, res) {
    const { id } = req.params;
    const device = await Device.findByPk(id);

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    await device.destroy();

    return res.status(204).json({ message: "Device removed successfully" });
  }

  async edit(req, res) {
    try {
      const { id } = req.params;
      const { name, price, brandId, typeId, description, img } = req.body;
      const device = await Device.findByPk(id);

      if (!device) {
        return res.status(404).json({ error: "Product not found" });
      }

      device.name = name;
      device.price = price;
      device.brandId = brandId;
      device.typeId = typeId;
      device.description = description;
      device.img = img;

      await device.save();

      return res.status(200).json(device);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new DeviceController();
