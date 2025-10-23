const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async function loginUsers(req, res) {
  try {
    const schema = {
      email: "email|empty:false",
      pass: "string|empty:false|min:6",
    };

    const validate = v.validate(req.body, schema);
    if (validate.length) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
      });
    }

    const user = await Users.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'invalid email',
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.pass, user.pass);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET not set in environment');
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    if (/^\d+$/.test(jwtExpiresIn)) {
      jwtExpiresIn = parseInt(jwtExpiresIn, 10);
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });

    const dataUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      profession: user.profession,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return res.status(200).json({
      success: true,
      message: 'User login successfully',
      token,
      data: dataUser,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};