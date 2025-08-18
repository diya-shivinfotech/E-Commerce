const { addProduct } = require('../services/productServices');

module.exports = {
  addProductController: (req, res) => {
    return addProduct(req, res);
  },
};
