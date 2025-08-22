const ProductVariant = require('../model/productVariantModel');
const OrderItem = require('../model/orderItemModel');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const {
  orderItemValidation,
  updateOrderItemValidation,
} = require('../validation/orderItemValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const { Status } = require('../utils/enums');

const addOrderItem = async (req, res) => {
  try {
    const { error } = orderItemValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { order_id, product_variant_id, quantity, unit_price } = req.body;

    const variant = await ProductVariant.findByPk(product_variant_id);
    if (!variant || variant.is_deleted) {
      logger.warn(messages.VARIANT_NOT_FOUND);
      return responseHandler.error(res, messages.VARIANT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (variant.quantity < quantity) {
      logger.warn(messages.INSUFFICIENT_STOCK);
      return responseHandler.error(res, messages.INSUFFICIENT_STOCK, StatusCodes.BAD_REQUEST);
    }

    await variant.update({ quantity: variant.quantity - quantity });

    await OrderItem.create({
      order_id,
      product_variant_id,
      quantity,
      unit_price,
      status: Status.PROGRESS,
    });

    logger.info(`Order Item added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order Item added ${messages.Is_SUCCESS}`,
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
    const searchableFields = [
      'quantity',
      'unit_price',
      '$productVariant.color$',
      '$productVariant.size$',
      '$productVariant.material$',
      '$productVariant.price$',
    ];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = { ...filter, is_deleted: false };

    const { count, rows } = await OrderItem.findAndCountAll({
      where: combinedFilter,
      include: [
        {
          model: ProductVariant,
          as: 'productVariant',
          attributes: ['color', 'size', 'material', 'price'],
        },
      ],
      order: [sort],
      offset: skip,
      limit,
      raw: true,
      nest: true,
    });

    if (count === 0) {
      logger.info(`Order Items ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order Items ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const paginatedData = formatPaginationResult(count, page, limit, rows);

    logger.info(`Order Items list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order Items list fetched ${messages.Is_SUCCESS}`,
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

    const item = await OrderItem.findOne({
      where: { id, is_deleted: false },
      include: [
        {
          model: ProductVariant,
          as: 'product_variant',
          attributes: ['color', 'size', 'material', 'price'],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!item) {
      logger.info(`Order Item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order Item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order Item details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order Item details fetched ${messages.Is_SUCCESS}`,
      item,
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

    const { id } = req.params;

    const orderItem = await OrderItem.update(req.body, { where: { id, is_deleted: false } });

    if (orderItem == 0) {
      logger.warn(`Order Item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order Item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order Item updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order Item updated ${messages.Is_SUCCESS}`,
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const orderItem = await OrderItem.findOne({ where: { id, is_deleted: false } });

    if (!orderItem) {
      logger.warn(messages.ORDER_ITEM_NOT_FOUND);
      return responseHandler.error(res, messages.ORDER_ITEM_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const variant = await ProductVariant.findByPk(orderItem.product_variant_id);
    if (!variant) {
      logger.warn(messages.VARIANT_NOT_FOUND);
      return responseHandler.error(res, messages.VARIANT_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (status === Status.CANCELLED) {
      await variant.update({ quantity: variant.quantity + orderItem.quantity });
    }

    await orderItem.update({ status });

    logger.info(`Order status updated to ${status} ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order status updated to ${status} ${messages.Is_SUCCESS}`,
      null,
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

const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const orderItem = await OrderItem.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (orderItem == 0) {
      logger.warn(`Order Item ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order Item ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order Item deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order Item deleted ${messages.Is_SUCCESS}`,
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
  updateOrderStatus,
  deleteOrderItem,
};
