const path = require("path");
const ApiError = require("../error/ApiError");
const { Device, Rating, User, Type, Brand } = require("../models/models");

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, description, img } = req.body;

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
    let { brandId, typeId, page, limit } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let devices;
    // if (!brandId && !typeId) {/
    // devices = await Device.findAndCountAll({ limit, offset });
    devices = await Device.findAndCountAll({
      include: [
        {
          model: Rating,
          required: false,
        },
      ],
    });
    // } else if (brandId && !typeId) {
    //   devices = await Device.findAndCountAll({
    //     where: { brandId },
    //     limit,
    //     offset,
    //   });
    // } else if (!brandId && typeId) {
    //   devices = await Device.findAndCountAll({
    //     where: { typeId },
    //     limit,
    //     offset,
    //   });
    // } else if (brandId && typeId) {
    //   devices = await Device.findAndCountAll({
    //     where: { typeId, brandId },
    //     limit,
    //     offset,
    //   });
    // }

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
}

module.exports = new DeviceController();
