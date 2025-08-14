const {
  addCategory,
  listOfCategory,
  viewCategory,
  updateCategory,
  deleteCategory,
} = require('../services/categoryService');

module.exports = {
  addCategoryController: (req, res) => {
    return addCategory(req, res);
  },
  listOfCategoryController: (req, res) => {
    return listOfCategory(req, res);
  },
  viewCategoryController: (req, res) => {
    return viewCategory(req, res);
  },
  updateCategoryController: (req, res) => {
    return updateCategory(req, res);
  },
  deleteCategoryController: (req, res) => {
    return deleteCategory(req, res);
  },
};
