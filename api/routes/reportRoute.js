const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const { listUsersController, listOrdersController } = require('../controller/reportController');

router.post('/listUsers', verifyToken([ROLE.ADMIN]), listUsersController);
router.post('/listOrders', verifyToken([ROLE.ADMIN]), listOrdersController);

module.exports = router;
