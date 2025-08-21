const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addCartItemController,
  listOfCartItemController,
  viewCartItemController,
  updateCartItemController,
  deleteCartItemController,
} = require('../controller/cartItemController');

router.post('/addCartItem', verifyToken([ROLE.USER]), addCartItemController);
router.post('/listOfCartItem', verifyToken([ROLE.USER]), listOfCartItemController);
router.get('/viewCartItem/:id', verifyToken([ROLE.USER]), viewCartItemController);
router.put('/updateCartItem/:id', verifyToken([ROLE.USER]), updateCartItemController);
router.delete('/deleteCartItem/:id', verifyToken([ROLE.USER]), deleteCartItemController);

module.exports = router;
