const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addOrderController,
  listOfOrderController,
  viewOrderController,
  deleteOrderController,
  updateOrderDetailsController,
  updateOrderStatusController
} = require('../controller/orderController');

router.post('/addOrder', verifyToken([ROLE.USER]), addOrderController);
router.post('/listOfOrder', verifyToken([ROLE.USER, ROLE.ADMIN]), listOfOrderController);
router.get('/viewOrder/:id', verifyToken([ROLE.USER]), viewOrderController);
router.put('/updateDetails/:id',verifyToken([ROLE.USER]),updateOrderDetailsController);
router.put('/updateStatus/:id',verifyToken([ROLE.ADMIN]),updateOrderStatusController);
router.delete('/deleteOrder/:id',verifyToken([ROLE.USER]),deleteOrderController);

module.exports = router;
