const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const { dashboardCountsController } = require('../controller/dashboardController');

router.get('/dashboardCount', verifyToken([ROLE.ADMIN]), dashboardCountsController);

module.exports = router;
