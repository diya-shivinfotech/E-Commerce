const express = require('express');
const router = express.Router();
const authRoute = require('./authRoute');
const locationRoute = require('./locationRoute');
const addressRoute = require('./addressRoute');

router.use('/auth',authRoute);
router.use('/location',locationRoute);
router.use('/address',addressRoute);

module.exports = router;