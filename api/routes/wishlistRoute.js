const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addWishlistController,
  listOfWishlistController,
  deleteWishlistController,
} = require('../controller/wishlistController');

router.post('/addWishlist', verifyToken([ROLE.USER]), addWishlistController);
router.post('/listOfWishlist', verifyToken([ROLE.USER]), listOfWishlistController);
router.delete('/deleteWishlist/:id', verifyToken([ROLE.USER]), deleteWishlistController);

module.exports = router;
