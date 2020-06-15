const express = require('express');
const router = express.router();

router.use('/users', require('./users'));

module.exports = router;