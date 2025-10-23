const bycrypt = require('bcrypt');
const { Users } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async function registerUsers(req, res) {
  try {
    const schema = {
      name: "string|empty:false",
      email: "email|empty:false",
      pass: "string|empty:false|min:6",
      profession: "string|empty:false",
      avatar: "string|optional",
      role: "string|in:admin,operator|empty:false",
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(200).json({
        success: false,
        message: 'Validation errors',
      });
    }
    const user = await Users.findOne({
      where: { email: req.body.email },
      attributes: ['id', 'name', 'email'],
    });
    if (user) {
      return res.status(200).json({
        success: false,
        message: 'User email already exists',
      });
    }
    const passwordHash = await bycrypt.hash(req.body.pass, 10);
    const data = {
      pass: passwordHash,
      name: req.body.name,
      email: req.body.email,
      profession: req.body.profession,
      avatar: req.body.avatar,
      role: req.body.role,
      createdAt: new Date(),
    };
    const newUser = await Users.create(data);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profession: newUser.profession,
        avatar: newUser.avatar,
        role: newUser.role,
        createdAt: newUser.createdAt,
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};