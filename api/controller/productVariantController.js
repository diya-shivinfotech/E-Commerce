const {
  addProductVariant,
  listOfProductVariant,
  viewProductVariant,
  updateProductVariant,
  deleteProductVariant,
} = require('../services/productVariantServices');

module.exports = {
  addProductVariantController: (req, res) => {
    return addProductVariant(req, res);
  },
  listOfProductVariantController: (req, res) => {
    return listOfProductVariant(req, res);
  },
  viewProductVariantController: (req, res) => {
    return viewProductVariant(req, res);
  },
  updateProductVariantController: (req, res) => {
    return updateProductVariant(req, res);
  },
  deleteProductVariantController: (req, res) => {
    return deleteProductVariant(req, res);
  },
};
