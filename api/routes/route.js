const express = require('express');
const router = express.Router();
const authRoute = require('./authRoute');
const locationRoute = require('./locationRoute');

router.use('/auth',authRoute);
router.use('/location',locationRoute);

module.exports = router;