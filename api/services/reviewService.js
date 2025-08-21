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
    const images = req.files?.length > 0 ? req.files.map((file) => file.filename).join(',') : null;
    const user_id = req.user.id;

    await Review.create({
      user_id,
      product_variant_id,
      ratings,
      comments,
      images,
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

const listOfReviews = async (req, res) => {
  try {
    const searchableFields = ['ratings', 'comments', '$user.name$'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await Review.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [{ model: User, as: 'user', attributes: ['name'], required: false }],
      order: [sort],
      offset: skip,
      limit,
      raw: true,
      nest: true,
    });

    if (totalCount === 0) {
      logger.info(`List ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `List ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const paginatedData = formatPaginationResult(totalCount, page, limit, addresses);

    logger.info(`Reviews list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Reviews list fetched ${messages.Is_SUCCESS}`,
      paginatedData,
      StatusCodes.OK,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const viewReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const review = await Review.findOne({
      where: {
        id,
        user_id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: User, as: 'user', attributes: ['name'], required: false },
      ],
      raw: true,
      nest: true,
    });

    if (!review) {
      logger.info(`Review item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Review item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Review item details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Review item details fetched ${messages.Is_SUCCESS}`,
      review,
      StatusCodes.OK,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateReview = async (req, res) => {
  try {
    const { error } = updateReviewValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;
    const user_id = req.user.id;

    const review = await Review.update(req.body, {
      where: {
        id,
        user_id,
        is_deleted: false,
      },
    });

    if (review == 0) {
      logger.warn(`Review item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Review item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Review item updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Review item updated ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.ACCEPTED,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteReview = async (req, res) => {
  try {
    const id = req.params.id;

    const review = await Review.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (review == 0) {
      logger.warn(`Review ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Review ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Review deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Review deleted ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.OK,
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
  listOfReviews,
  viewReview,
  updateReview,
  deleteReview
};
