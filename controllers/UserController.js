const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");

const generateJwt = (values) => {
  return jwt.sign({ ...values }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async register(req, res, next) {
    const {
      email,
      password,
      role,
      avatar,
      address,
      phone_number,
      first_name,
      last_name,
    } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email && pasword are required"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("User with this email exist already!"));
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const user = await User.create({
      ...req.body,
      password: hashPassword,
    });

    const token = generateJwt({
      id: user.id,
      email,
      role,
      avatar,
      address,
      phone_number,
      first_name,
      last_name,
    });
    res.json(token);
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(ApiError.internal("User hasn't been registered!"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Password is wrong!"));
    }
    const token = generateJwt({
      id: user.id,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      address: user.address,
      phone_number: user.phone_number,
      first_name: user.first_name,
      last_name: user.last_name,
    });
    res.json({ token });
  }

  async check(req, res, next) {
    // const { id } = req.query;
    // if (!id) {
    //   return next(ApiError.badRequest("id is missing"));
    // }
    res.json("id");
  }
}

module.exports = new UserController();
