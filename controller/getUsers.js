const { Users } = require('../models');

module.exports = async function getUsers(req, res) {
  try {
    const usersData = await Users.findAll();
    if (!usersData || usersData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Users data not found'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: usersData
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
