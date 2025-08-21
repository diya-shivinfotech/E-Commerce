const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { cartValidation } = require('../validation/cartValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Cart = require('../model/cartModel');
const User = require('../model/authModel');

const addCart = async (req, res) => {
  try {
    const { error } = cartValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { total_amount } = req.body;

    const user_id = req.user.id;

    await Cart.create({
      user_id,
      total_amount,
    });

    logger.info(`Cart added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart added ${messages.Is_SUCCESS}`,
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

const listOfCart = async (req, res) => {
  try {
    const searchableFields = ['total_amount', '$user.name$'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await Cart.findAndCountAll({
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

    logger.info(`Cart list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart list fetched ${messages.Is_SUCCESS}`,
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

const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;

    const cart = await Cart.update({ is_deleted: true }, { where: { id, is_deleted: false } });

    if (cart == 0) {
      logger.warn(`Cart ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Cart ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Cart deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart deleted ${messages.Is_SUCCESS}`,
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
  addCart,
  listOfCart,
  deleteCart,
};
