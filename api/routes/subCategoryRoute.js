const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addsubCategoryController,
  listOfsubCategoryController,
  viewsubCategoryController,
  updatesubCategoryController,
  deletesubCategoryController,
} = require('../controller/subCategoryController');

router.post('/addsubCategory', verifyToken([ROLE.ADMIN]), addsubCategoryController);
router.post(
  '/listOfsubCategory',
  verifyToken([ROLE.ADMIN, ROLE.USER]),
  listOfsubCategoryController,
);
router.get('/viewsubCategory/:id', verifyToken([ROLE.ADMIN, ROLE.USER]), viewsubCategoryController);
router.put('/updatesubCategory/:id', verifyToken([ROLE.ADMIN]), updatesubCategoryController);
router.delete('/deletesubCategory/:id', verifyToken([ROLE.ADMIN]), deletesubCategoryController);

module.exports = router;
