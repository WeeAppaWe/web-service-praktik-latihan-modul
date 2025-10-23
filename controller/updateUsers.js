const bycrypt = require('bcrypt');
const { Users } = require('../models');
const Validator = require('fastest-validator');
const v = new Validator();

module.exports = async function updateUsers(req, res) {
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
    const id = req.params.id;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User ID not found',
      });
    }

    const email = req.body.email;
    if (email) {
      const checkEmail = await Users.findOne({
        where: { email },
      });
      if (checkEmail && email !== user.email) {
        return res.status(200).json({
          success: false,
          message: 'Email already exists',
        });
      }
    }

    const passwordHash = await bycrypt.hash(req.body.pass, 10);
    const data = {
      pass: passwordHash,
      name: req.body.name,
      email: req.body.email,
      profession: req.body.profession,
      avatar: req.body.avatar,
      role: req.body.role,
      updatedAt: new Date(),
    };

    await Users.update(data, {
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id,
        ...data,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
