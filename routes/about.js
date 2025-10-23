const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('This is the about page, providing information about this application, built by Agung');
});

module.exports = router;
