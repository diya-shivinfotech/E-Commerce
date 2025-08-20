const { addCart, listOfCart, deleteCart } = require('../services/cartService');

module.exports = {
  addCartController: (req, res) => {
    return addCart(req, res);
  },
  listOfCartController: (req, res) => {
    return listOfCart(req, res);
  },
  deleteCartController: (req, res) => {
    return deleteCart(req, res);
  },
};
