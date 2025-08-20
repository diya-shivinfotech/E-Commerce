const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addCartController,
  listOfCartController,
  deleteCartController,
} = require('../controller/cartController');

router.post('/addCart', verifyToken([ROLE.USER]), addCartController);
router.post('/listOfCart', verifyToken([ROLE.USER]), listOfCartController);
router.delete('/deleteCart/:id', verifyToken([ROLE.USER]), deleteCartController);

module.exports = router;
