const { addReview } = require('../services/reviewService');

module.exports = {
  addReviewController: (req, res) => {
    return addReview(req, res);
  },
};
