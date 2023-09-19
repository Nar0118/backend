const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const { User, Basket } = require("../models/models");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id: id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async register(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email && pasword are required"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("User with this email exist already!"));
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const user = await User.create({ email, role, password: hashPassword });
    const token = generateJwt(user.id, email, role);
    res.json(token);
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      next(ApiError.internal("User hasn't been registered!"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      next(ApiError.internal("Password is wrong!"));
    }
    const token = generateJwt(user.id, user.email, user.role);
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
