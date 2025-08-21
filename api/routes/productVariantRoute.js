const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const upload = require('../middleware/multer');
const {
  addProductVariantController,
  listOfProductVariantController,
  viewProductVariantController,
  updateProductVariantController,
  deleteProductVariantController,
} = require('../controller/productVariantController');

router.post(
  '/addProductVariant',
  upload.single('image'),
  verifyToken([ROLE.ADMIN]),
  addProductVariantController,
);
router.post(
  '/listOfProductVariant',
  verifyToken([ROLE.ADMIN, ROLE.USER]),
  listOfProductVariantController,
  deleteProductVariantController,
);
router.get('/viewProductVariant/:id', verifyToken([ROLE.ADMIN]), viewProductVariantController);
router.put(
  '/updateProductVariant/:id',
  upload.single('image'),
  verifyToken([ROLE.ADMIN]),
  updateProductVariantController,
);
router.delete(
  '/deleteProductVariant/:id',
  verifyToken([ROLE.ADMIN, ROLE.USER]),
  deleteProductVariantController,
);

module.exports = router;
