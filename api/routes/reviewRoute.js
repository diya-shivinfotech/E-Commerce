const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const upload = require('../middleware/multer');
const {
  addReviewController,
  listOfReviewsController,
  viewReviewController,
  updateReviewController,
  deleteReviewController,
} = require('../controller/reviewController');

router.post('/addReview', verifyToken([ROLE.USER]), upload.array('images'), addReviewController);
router.post('/listOfReviews', verifyToken([ROLE.USER, ROLE.ADMIN]), listOfReviewsController);
router.get('/viewReview/:id', verifyToken([ROLE.ADMIN, ROLE.USER]), viewReviewController);
router.put('/updateReview/:id', verifyToken([ROLE.USER]), updateReviewController);
router.delete('/deleteReview/:id', verifyToken([ROLE.USER]), deleteReviewController);

module.exports = router;
