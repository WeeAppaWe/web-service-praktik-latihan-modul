const { Users } = require('../models');

module.exports = async function delUsers(req, res) {
  try {
    const id = req.params.id;
    const user = await Users.findByPk(id, {
      attributes: ['id', 'name', 'email', 'profession', 'avatar', 'role', 'created_at', 'updated_at'],
    });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User ID not found',
      });
    } else {
      await user.destroy();
    }
    const sqlOptions = {
      attributes: ['id', 'name', 'email', 'profession', 'avatar', 'role', 'created_at', 'updated_at'],
    }
    const users = await Users.findAll(sqlOptions);
    return res.status(200).json({
      status: true,
      message: 'User deleted successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
