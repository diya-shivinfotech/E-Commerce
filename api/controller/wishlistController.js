const { addWishlist, listOfWishlist, deleteWishlist } = require('../services/wishlistService');

module.exports = {
  addWishlistController: (req, res) => {
    return addWishlist(req, res);
  },
  listOfWishlistController: (req, res) => {
    return listOfWishlist(req, res);
  },
  deleteWishlistController: (req, res) => {
    return deleteWishlist(req, res);
  },
};
