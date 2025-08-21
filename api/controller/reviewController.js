const {
  addReview,
  listOfReviews,
  viewReview,
  updateReview,
  deleteReview,
} = require('../services/reviewService');

module.exports = {
  addReviewController: (req, res) => {
    return addReview(req, res);
  },
  listOfReviewsController: (req, res) => {
    return listOfReviews(req, res);
  },
  viewReviewController: (req, res) => {
    return viewReview(req, res);
  },
  updateReviewController: (req, res) => {
    return updateReview(req, res);
  },
  deleteReviewController: (req, res) => {
    return deleteReview(req, res);
  },
};
