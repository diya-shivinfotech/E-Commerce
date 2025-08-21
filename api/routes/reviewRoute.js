const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const upload = require('../middleware/multer');
const { addReviewController } = require('../controller/reviewController');

router.post('/addReview', verifyToken([ROLE.USER]), upload.array('image'), addReviewController);

module.exports = router;
