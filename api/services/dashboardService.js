const { StatusCodes } = require('http-status-codes');
const User = require('../model/authModel');
const Order = require('../model/orderModel');
const { ROLE, Status } = require('../utils/enums');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/messages');

const dashboardCounts = async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: { is_deleted: false, role: ROLE.USER },
    });

    const totalOrders = await Order.count({
      where: { is_deleted: false },
    });

    const orderStatusCounts = await Order.findAll({
      attributes: ['status', [Order.sequelize.fn('COUNT', Order.sequelize.col('status')), 'count']],
      where: { is_deleted: false },
      group: ['status'],
      raw: true,
    });

    const statusCounts = {
      [Status.PROGRESS]: 0,
      [Status.DELIVERED]: 0,
      [Status.CANCELLED]: 0,
    };

    orderStatusCounts.forEach((row) => {
      statusCounts[row.status] = row.count;
    });

    const result = {
      totalUsers,
      totalOrders,
      orderStatusCounts: statusCounts,
    };

    logger.info(`Dashboard counts fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Dashboard counts fetched ${messages.Is_SUCCESS}`,
      result,
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

module.exports = { dashboardCounts };
