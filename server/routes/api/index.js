const express = require('express');
const router = require('express').Router();

router.use('/users', require('./users'));

module.exports = router;