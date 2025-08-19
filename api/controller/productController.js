const {
  addProduct,
  listOfProduct,
  viewProduct,
  updateProduct,
  deleteProduct,
} = require('../services/productService');

module.exports = {
  addProductController: (req, res) => {
    return addProduct(req, res);
  },
  listOfProductController: (req, res) => {
    return listOfProduct(req, res);
  },
  viewProductController: (req, res) => {
    return viewProduct(req, res);
  },
  updateProductController: (req, res) => {
    return updateProduct(req, res);
  },
  deleteProductController: (req, res) => {
    return deleteProduct(req, res);
  },
};
