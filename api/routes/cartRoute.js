const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addCartController,
  listOfCartController,
  viewCartController,
  updateCartController,
  deleteCartController,
} = require('../controller/cartController');

router.post('/addCart', verifyToken([ROLE.USER]), addCartController);
router.post('/listOfCart', verifyToken([ROLE.USER]), listOfCartController);
router.get('/viewCart/:id', verifyToken([ROLE.USER]), viewCartController);
router.put('/updateCart/:id', verifyToken([ROLE.USER]), updateCartController);
router.delete('/deleteCart/:id', verifyToken([ROLE.USER]), deleteCartController);

module.exports = router;
