const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { wishlistValidation } = require('../validation/wishlistValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const User = require('../model/authModel');
const Wishlist = require('../model/wishlistModel');

const addWishlist = async (req, res) => {
  try {
    const { error } = wishlistValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { product_variant_id } = req.body;

    const user_id = req.user.id;

    await Wishlist.create({
      user_id,
      product_variant_id,
    });

    logger.info(`Wishlist added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Wishlist added ${messages.Is_SUCCESS}`,
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

const listOfWishlist = async (req, res) => {
  try {
    const searchableFields = ['$user.name$'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await Wishlist.findAndCountAll({
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

    logger.info(`Wishlist list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Wishlist list fetched ${messages.Is_SUCCESS}`,
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

const deleteWishlist = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedWishlist = await Wishlist.destroy({
      where: { id },
    });

    if (deletedWishlist === 0) {
      logger.warn(`Wishlist ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Wishlist ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Wishlist deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Wishlist deleted ${messages.Is_SUCCESS}`,
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
  addWishlist,
  listOfWishlist,
  deleteWishlist,
};
