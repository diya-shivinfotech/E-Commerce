const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addCategoryController,
  listOfCategoryController,
  viewCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require('../controller/categoryController');
const upload = require('../middleware/multer');

router.post(
  '/addCategory',
  verifyToken([ROLE.ADMIN]),
  upload.single('image'),
  addCategoryController,
);
router.post('/listOfCategory', verifyToken([ROLE.ADMIN, ROLE.USER]), listOfCategoryController);
router.get('/viewCategory/:id', verifyToken([ROLE.ADMIN, ROLE.USER]), viewCategoryController);
router.put('/updateCategory/:id', verifyToken([ROLE.ADMIN]), updateCategoryController);
router.delete('/deleteCategory/:id', verifyToken([ROLE.ADMIN]), deleteCategoryController);

module.exports = router;
