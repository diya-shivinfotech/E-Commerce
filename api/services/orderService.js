const Address = require('../model/addressModel');
const User = require('../model/authModel');
const Order = require('../model/orderModel');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { orderValidation, updateOrderValidation } = require('../validation/orderValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const { Op } = require('sequelize');
const { Status } = require('../utils/enums');
const { City } = require('../model/cityModel');
const { State } = require('../model/stateModel');
const Country = require('../model/countryModel');
const productVariant = require('../model/productVariantModel');

const addOrder = async (req, res) => {
  try {
    const { error } = orderValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { address_id, product_variant_id, quantity, shipping_address, billing_address } =
      req.body;
    const user_id = req.user.id;

    const variant = await productVariant.findByPk(product_variant_id);

    if (!variant || variant.quantity < quantity) {
      logger.warn(messages.OUT_OF_STOCK);
      return responseHandler.error(res, messages.OUT_OF_STOCK, StatusCodes.BAD_REQUEST);
    }

    await Order.create({
      user_id,
      address_id,
      product_variant_id,
      quantity,
      shipping_address,
      billing_address,
    });

    logger.info(`Order added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order added ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.CREATED,
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

const listOfOrder = async (req, res) => {
  try {
    const searchableFields = [
      'shipping_address',
      'billing_address',
      '$user.name$',
      '$address.address_line1$',
      '$address.zip_code$',
      '$address.city.city_name$',
      '$address.state.state_name$',
      '$address.country.country_name$',
      '$product_variant.color$',
      '$product_variant.size$',
      '$product_variant.material$',
      '$product_variant.price$',
      '$product_variant.quantity$',
    ];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: orders } = await Order.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: User, as: 'user', attributes: ['name'], required: false },
        {
          model: Address,
          as: 'address',
          attributes: ['address_line1', 'zip_code'],
          required: false,
          include: [
            { model: City, as: 'city', attributes: ['city_name'], required: false },
            { model: State, as: 'state', attributes: ['state_name'], required: false },
            { model: Country, as: 'country', attributes: ['country_name'], required: false },
          ],
        },
        {
          model: productVariant,
          as: 'product_variant',
          attributes: ['color', 'size', 'material', 'price', 'quantity'],
          required: false,
        },
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

    const paginatedData = formatPaginationResult(totalCount, page, limit, orders);

    logger.info(`Order list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order list fetched ${messages.Is_SUCCESS}`,
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

const viewOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const order = await Order.findOne({
      where: {
        id,
        user_id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
          required: false,
        },
        {
          model: Address,
          as: 'address',
          attributes: ['address_line1', 'zip_code'],
          include: [
            { model: Country, as: 'country', attributes: ['country_name'], required: false },
            { model: State, as: 'state', attributes: ['state_name'], required: false },
            { model: City, as: 'city', attributes: ['city_name'], required: false },
          ],
          required: false,
        },
        {
          model: productVariant,
          as: 'product_variant',
          attributes: ['color', 'size', 'material', 'price'],
          required: false,
        },
      ],
      raw: true,
      nest: true,
    });

    if (!order) {
      logger.info(`Order ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const grandTotal = (order.quantity || 0) * (order.product_variant?.price || 0);

    logger.info(`Order details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order details fetched ${messages.Is_SUCCESS}`,
      { ...order, grandTotal },
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

const updateOrderDetails = async (req, res) => {
  try {
    const { error } = updateOrderValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.update(req.body, {
      where: {
        id,
        user_id: userId,
        is_deleted: false,
        status: { [Op.notIn]: [Status.DELIVERED, Status.CANCELLED] },
      },
    });

    if (order == 0) {
      logger.warn(`Order ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order updated ${messages.Is_SUCCESS}`,
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
    const { error } = updateOrderValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { id } = req.params;
    const newStatus = req.body.status;

    const order = await Order.findOne({
      where: {
        id,
        status: { [Op.notIn]: [Status.DELIVERED, Status.CANCELLED] },
      },
      include: [{ model: productVariant, as: 'product_variant' }],
    });

    if (!order) {
      logger.warn(`Order ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    if (newStatus === Status.CONFIRMED && order.product_variant) {
      if (order.product_variant.quantity < order.quantity) {
        logger.warn(messages.OUT_OF_STOCK);
        return responseHandler.error(res, messages.OUT_OF_STOCK, StatusCodes.BAD_REQUEST);
      }
      order.product_variant.quantity -= order.quantity;
      await order.product_variant.save();
    } else if (newStatus === Status.CANCELLED && order.product_variant) {
      order.product_variant.quantity += order.quantity;
      await order.product_variant.save();
    }

    order.status = newStatus;
    await order.save();

    logger.info(`Order status ${newStatus} ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order status ${newStatus} ${messages.Is_SUCCESS}`,
      { order_id: id, status: newStatus },
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

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.update({ is_deleted: true }, { where: { id, is_deleted: false } });

    if (order == 0) {
      logger.warn(`Order ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Order ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order deleted ${messages.Is_SUCCESS}`,
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
  addOrder,
  listOfOrder,
  viewOrder,
  deleteOrder,
  updateOrderDetails,
  updateOrderStatus,
};
