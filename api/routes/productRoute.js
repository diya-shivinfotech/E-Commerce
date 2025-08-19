const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addProductController,
  listOfProductController,
  viewProductController,
  updateProductController,
  deleteProductController,
} = require('../controller/productController');

router.post('/addProduct', verifyToken([ROLE.ADMIN]), addProductController);
router.post('/listOfProduct', verifyToken([ROLE.ADMIN, ROLE.USER]), listOfProductController);
router.get('/viewProduct/:id', verifyToken([ROLE.ADMIN]), viewProductController);
router.put('/updateProduct/:id', verifyToken([ROLE.ADMIN]), updateProductController);
router.delete('/deleteProduct/:id', verifyToken([ROLE.ADMIN]), deleteProductController);

module.exports = router;
