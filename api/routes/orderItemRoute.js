const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addOrderItemController,
  listOfOrderItemController,
  viewOrderItemController,
  updateOrderItemController,
  deleteOrderItemController,
} = require('../controller/orderItemController');

router.post('/addOrderItem', verifyToken([ROLE.USER]), addOrderItemController);
router.post('/listOfOrderItem', verifyToken([ROLE.ADMIN, ROLE.USER]), listOfOrderItemController);
router.get('/viewOrderItem/:id', verifyToken([ROLE.USER]), viewOrderItemController);
router.put('/updateOrderItem/:id', verifyToken([ROLE.USER]), updateOrderItemController);
router.delete('/deleteOrderItem/:id', verifyToken([ROLE.USER]), deleteOrderItemController);

module.exports = router;
