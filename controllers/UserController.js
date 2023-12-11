const bcrypt = require("bcrypt");
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");

const generateJwt = (values) => {
  return jwt.sign({ ...values }, process.env.SECRET_KEY, {
    expiresIn: '240h',
  });
};

class UserController {
  async register(req, res) {
    const {
      email,
      password,
      avatar,
      address,
      phone_number,
      first_name,
      last_name,
    } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email && password are required!" });
    }
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      return res
        .status(400)
        .json({ message: "User with this email exist already!" });
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const user = await User.create({
      ...req.body,
      password: hashPassword,
    });

    const token = generateJwt({
      id: user.id,
      email,
      role: user.role,
      address,
      phone_number,
      first_name,
      last_name,
    });
    res.json(token);
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User hasn't been registered!" });
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ message: "Password is wrong!" });
    }
    const token = generateJwt({
      id: user.id,
      email: user.email,
      role: user.role,
      address: user.address,
      phone_number: user.phone_number,
      first_name: user.first_name,
      last_name: user.last_name,
    });
    res.json({ token });
  }

  async update(req, res) {
    try {
      const { id, role } = req.user;
      const {
        email,
        oldPassword,
        newPassword,
        avatar,
        address,
        phone_number,
        first_name,
        last_name,
        confirmPassword,
      } = req.body;
      let password;

      if (oldPassword && oldPassword && confirmPassword) {
        if (confirmPassword !== newPassword) {
          return res
            .status(400)
            .json({ message: "Confirm password is wrong!" });
        } else if (oldPassword === newPassword) {
          return res.status(400).json({
            message: "New password is the same password as before!",
          });
        }

        password = await bcrypt.hash(newPassword, 7);
      }

      const token = generateJwt({
        id: req.user.id,
        email,
        role,
        address,
        phone_number,
        first_name,
        last_name,
      });

      const user = await User.update(
        {
          email,
          role,
          avatar,
          address,
          phone_number,
          first_name,
          last_name,
          password,
        },
        {
          where: { id },
        }
      );

      return res.status(203).json({ user, token });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async check(req, res) {
    const { id } = req.user;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  }
}

module.exports = new UserController();
