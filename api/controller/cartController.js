const {
  addCart,
  listOfCart,
  deleteCart,
  viewCart,
  updateCart,
} = require('../services/cartService');

module.exports = {
  addCartController: (req, res) => {
    return addCart(req, res);
  },
  listOfCartController: (req, res) => {
    return listOfCart(req, res);
  },
  viewCartController: (req, res) => {
    return viewCart(req, res);
  },
  updateCartController: (req, res) => {
    return updateCart(req, res);
  },
  deleteCartController: (req, res) => {
    return deleteCart(req, res);
  },
};
