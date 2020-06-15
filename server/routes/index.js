const express = require ('express');
const router = express.router();

router.use('/api', require('./api'));

module.exports= router