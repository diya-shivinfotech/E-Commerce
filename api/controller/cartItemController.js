const {
  addCartItem,
  listOfCartItem,
  viewCartItem,
  updateCartItem,
  deleteCartItem,
} = require('../services/cartItemService');

module.exports = {
  addCartItemController: (req, res) => {
    return addCartItem(req, res);
  },
  listOfCartItemController: (req, res) => {
    return listOfCartItem(req, res);
  },
  viewCartItemController: (req, res) => {
    return viewCartItem(req, res);
  },
  updateCartItemController: (req, res) => {
    return updateCartItem(req, res);
  },
  deleteCartItemController: (req, res) => {
    return deleteCartItem(req, res);
  },
};
