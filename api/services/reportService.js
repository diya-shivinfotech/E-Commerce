const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Order = require('../model/orderModel');
const User = require('../model/authModel');
const { ROLE, STATUS } = require('../utils/enums');
const Address = require('../model/addressModel');

const listUsers = async (req, res) => {
  try {
    const searchableFields = ['name', 'email'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
      role: ROLE.USER,
      status: STATUS.ACTIVE,
    };

    const { count: totalCount, rows: users } = await User.findAndCountAll({
      where: combinedFilter,
      attributes: ['name', 'email', 'phone_number', 'profile_image'],
      order: [sort],
      offset: skip,
      limit,
      nest: true,
      subQuery: false,
      distinct: true,
    });

    if (totalCount === 0) {
      logger.info(`Users list ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Users list ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const paginatedData = formatPaginationResult(totalCount, page, limit, users);

    logger.info(`Users list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Users list fetched ${messages.Is_SUCCESS}`,
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

const listOrders = async (req, res) => {
  try {
    const searchableFields = [
      'shipping_address',
      'billing_address',
      '$user.name$',
      '$address.address_line1$',
    ];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: orders } = await Order.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt', 'user_id', 'address_id'] },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'phone_number'],
          required: false,
        },
        {
          model: Address,
          as: 'address',
          attributes: ['address_line1'],
          required: false,
        },
      ],
      order: [sort],
      offset: skip,
      limit,
      nest: true,
      subQuery: false,
      distinct: true,
    });

    if (totalCount === 0) {
      logger.info(`Orders list ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Orders list ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const paginatedData = formatPaginationResult(totalCount, page, limit, orders);

    logger.info(`Orders list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Orders list fetched ${messages.Is_SUCCESS}`,
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

module.exports = {
  listUsers,
  listOrders,
};
