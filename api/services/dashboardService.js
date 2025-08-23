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

    const orderStatusCounts = await Order.findOne({
      attributes: [
        [
          Order.sequelize.fn(
            'COUNT',
            Order.sequelize.literal(
              `CASE WHEN status = '${Status.PROGRESS}' AND is_deleted = false THEN 1 END`,
            ),
          ),
          'progressCount',
        ],
        [
          Order.sequelize.fn(
            'COUNT',
            Order.sequelize.literal(
              `CASE WHEN status = '${Status.DELIVERED}' AND is_deleted = false THEN 1 END`,
            ),
          ),
          'deliveredCount',
        ],
        [
          Order.sequelize.fn(
            'COUNT',
            Order.sequelize.literal(
              `CASE WHEN status = '${Status.CANCELLED}' AND is_deleted = false THEN 1 END`,
            ),
          ),
          'cancelledCount',
        ],
      ],
      raw: true,
    });

    const statusCounts = {
      [Status.PROGRESS]: orderStatusCounts.progressCount || 0,
      [Status.DELIVERED]: orderStatusCounts.deliveredCount || 0,
      [Status.CANCELLED]: orderStatusCounts.cancelledCount || 0,
    };

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
