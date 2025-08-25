const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  dashboardCountsController,
  graphOfUserController,
  graphOfOrderController,
} = require('../controller/dashboardController');

router.get('/dashboardCount', verifyToken([ROLE.ADMIN]), dashboardCountsController);
router.post('/graphOfUser', verifyToken([ROLE.ADMIN]), graphOfUserController);
router.post('/graphOfOrder', verifyToken([ROLE.ADMIN]), graphOfOrderController);

module.exports = router;
