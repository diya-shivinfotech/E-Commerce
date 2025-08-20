const Product = require('../model/productModel');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const {
  orderItemValidation,
  updateOrderItemValidation,
} = require('../validation/orderItemValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const orderItem = require('../model/orderItemModel');

const addOrderItem = async (req, res) => {
  try {
    const { error } = orderItemValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { order_id, product_id, quantity, unit_price } = req.body;

    await orderItem.create({
      order_id,
      product_id,
      quantity,
      unit_price,
    });

    logger.info(`Order item added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order item added ${messages.Is_SUCCESS}`,
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

const listOfOrderItem = async (req, res) => {
  try {
    const searchableFields = ['quantity', 'unit_price', '$product.name$'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await orderItem.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [{ model: Product, as: 'product', attributes: ['name'], required: false }],
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

    logger.info(`Order item list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order item list fetched ${messages.Is_SUCCESS}`,
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

const viewOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const order_item = await orderItem.findOne({
      where: {
        id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [{ model: Product, as: 'product', attributes: ['name'], required: false }],
      raw: true,
      nest: true,
    });

    if (!order_item) {
      logger.info(`Order item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order item details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `order item details fetched ${messages.Is_SUCCESS}`,
      order_item,
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

const updateOrderItem = async (req, res) => {
  try {
    const { error } = updateOrderItemValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;

    const order_item = await orderItem.update(req.body, {
      where: {
        id,
        is_deleted: false,
      },
    });

    if (order_item == 0) {
      logger.warn(`Product ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Product ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Product updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product updated ${messages.Is_SUCCESS}`,
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

const deleteOrderItem = async (req, res) => {
  try {
    const id = req.params.id;

    const order_item = await orderItem.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (order_item == 0) {
      logger.warn(`Order item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order item deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order item deleted ${messages.Is_SUCCESS}`,
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
  addOrderItem,
  listOfOrderItem,
  viewOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
