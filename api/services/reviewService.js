const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { reviewValidation, updateReviewValidation } = require('../validation/reviewValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Review = require('../model/reviewModel');
const User = require('../model/authModel');

const addReview = async (req, res) => {
  try {
    const { error } = reviewValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { product_variant_id, ratings, comments } = req.body;
    const image = req.file ? req.file.filename : null;
    const user_id = req.user.id;

    await Review.create({
      user_id,
      product_variant_id,
      ratings,
      comments,
      image,
    });

    logger.info(`Reviews added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Reviews added ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.CREATED,
    );
  } catch (err) {
    logger.error(err.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

module.exports = {
  addReview,
};
