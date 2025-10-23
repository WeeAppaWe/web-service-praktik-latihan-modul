const express = require('express');
const router = express.Router();
const userController = require('../controller');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/get-all', userController.getUsers);
router.post('/register', userController.registerUsers);
router.post('/login', userController.loginUsers);
router.put('/update/:id', userController.updateUsers);
router.delete('/delete/:id', userController.deleteUsers);

module.exports = router;
