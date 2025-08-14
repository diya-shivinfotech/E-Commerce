const {
  addsubCategory,
  listOfsubCategory,
  viewsubCategory,
  updatesubCategory,
  deletesubCategory,
} = require('../services/subCategoryService');

module.exports = {
  addsubCategoryController: (req, res) => {
    return addsubCategory(req, res);
  },
  listOfsubCategoryController: (req, res) => {
    return listOfsubCategory(req, res);
  },
  viewsubCategoryController: (req, res) => {
    return viewsubCategory(req, res);
  },
  updatesubCategoryController: (req, res) => {
    return updatesubCategory(req, res);
  },
  deletesubCategoryController: (req, res) => {
    return deletesubCategory(req, res);
  },
};
