const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const {
  cartItemValidation,
  updateCartItemValidation,
} = require('../validation/cartItemValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Cart = require('../model/cartModel');
const User = require('../model/authModel');
const cartItem = require('../model/cartItemModel');

const addCartItem = async (req, res) => {
  try {
    const { error } = cartItemValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { product_variant_id, cart_id, quantity, unit_price } = req.body;

    const user_id = req.user.id;

    await cartItem.create({
      user_id,
      product_variant_id,
      cart_id,
      quantity,
      unit_price,
    });

    logger.info(`Cart item added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart item added ${messages.Is_SUCCESS}`,
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

const listOfCartItem = async (req, res) => {
  try {
    const searchableFields = ['quantity', 'unit_price', '$cart.total_amount$', '$user.name$'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await cartItem.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: User, as: 'user', attributes: ['name'], required: false },
        { model: Cart, as: 'cart', attributes: ['total_amount'], required: false },
      ],
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

    logger.info(`Cart item list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart item list fetched ${messages.Is_SUCCESS}`,
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

const viewCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const cart_item = await cartItem.findOne({
      where: {
        id,
        user_id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: User, as: 'user', attributes: ['name'], required: false },
        { model: Cart, as: 'cart', attributes: ['total_amount'], required: false },
      ],
      raw: true,
      nest: true,
    });

    if (!cart_item) {
      logger.info(`Cart item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Cart item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Cart item details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart item details fetched ${messages.Is_SUCCESS}`,
      cart_item,
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

const updateCartItem = async (req, res) => {
  try {
    const { error } = updateCartItemValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;
    const user_id = req.user.id;

    const cart_item = await cartItem.update(req.body, {
      where: {
        id,
        user_id,
        is_deleted: false,
      },
    });

    if (cart_item == 0) {
      logger.warn(`Cart item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Cart item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Cart item updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart item updated ${messages.Is_SUCCESS}`,
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

const deleteCartItem = async (req, res) => {
  try {
    const id = req.params.id;

    const cart_item = await cartItem.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (cart_item == 0) {
      logger.warn(`Cart item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Cart item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Cart item deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Cart item deleted ${messages.Is_SUCCESS}`,
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
  addCartItem,
  listOfCartItem,
  viewCartItem,
  updateCartItem,
  deleteCartItem,
};
