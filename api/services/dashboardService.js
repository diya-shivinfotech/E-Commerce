const { StatusCodes } = require('http-status-codes');
const User = require('../model/authModel');
const Order = require('../model/orderModel');
const { ROLE, Status } = require('../utils/enums');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/messages');
const { Op, fn, col, literal } = require('sequelize');
const { GRAPH, STATUS } = require('../utils/enums');
const moment = require('moment');

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

const graphOfUser = async (req, res) => {
  try {
    const type = req.body.type || GRAPH.YEARLY;

    let result = {};

    if (type === GRAPH.YEARLY) {
      const yearly = await User.findAll({
        attributes: [
          [fn('YEAR', col('createdAt')), 'year'],
          [fn('COUNT', col('id')), 'count'],
        ],
        where: {
          status: STATUS.ACTIVE,
          is_deleted: false,
        },
        group: [fn('YEAR', col('createdAt'))],
        order: [[literal('year'), 'ASC']],
        raw: true,
      });

      result.yearly = yearly.length > 0 ? yearly : { message: messages.NOT_FOUND };
    }

    if (type === GRAPH.MONTHLY) {
      const monthly = await User.findAll({
        attributes: [
          [fn('MONTH', col('createdAt')), 'monthNumber'],
          [fn('COUNT', col('id')), 'count'],
        ],
        where: {
          status: STATUS.ACTIVE,
          is_deleted: false,
          createdAt: {
            [Op.between]: [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
          },
        },
        group: [fn('MONTH', col('createdAt'))],
        order: [[literal('monthNumber'), 'ASC']],
        raw: true,
      });

      const months = [
        '',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const formattedMonthly = monthly.map((m) => ({
        month: months[m.monthNumber],
        count: m.count,
      }));

      result.monthly =
        formattedMonthly.length > 0 ? formattedMonthly : { message: messages.NOT_FOUND };
    }

    if (type === GRAPH.WEEKLY) {
      const weekly = await User.findAll({
        attributes: [
          [fn('WEEK', col('createdAt')), 'week'],
          [fn('COUNT', col('id')), 'count'],
        ],
        where: {
          status: STATUS.ACTIVE,
          is_deleted: false,
          createdAt: {
            [Op.between]: [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
          },
        },
        group: [fn('WEEK', col('createdAt'))],
        order: [[literal('week'), 'ASC']],
        raw: true,
      });

      result.weekly = weekly.length > 0 ? weekly : { message: messages.NOT_FOUND };
    }

    logger.info(`User graph data fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `User graph data fetched ${messages.Is_SUCCESS}`,
      result,
      StatusCodes.OK,
    );
  } catch (error) {
    logger.error(error.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      error.message || messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const graphOfOrder = async (req, res) => {
  try {
    const type = req.body.type || GRAPH.YEARLY;

    let result = {};

    if (type === GRAPH.YEARLY) {
      const yearly = await Order.findAll({
        attributes: [
          [fn('YEAR', col('createdAt')), 'year'],
          'status',
          [fn('COUNT', col('id')), 'count'],
        ],
        where: { is_deleted: false },
        group: [fn('YEAR', col('createdAt')), 'status'],
        order: [[literal('year'), 'ASC']],
        raw: true,
      });

      result.yearly = yearly.length > 0 ? yearly : { message: messages.NOT_FOUND };
    }

    if (type === GRAPH.MONTHLY) {
      const monthly = await Order.findAll({
        attributes: [
          [fn('MONTH', col('createdAt')), 'monthNumber'],
          'status',
          [fn('COUNT', col('id')), 'count'],
        ],
        where: {
          is_deleted: false,
          createdAt: {
            [Op.between]: [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
          },
        },
        group: [fn('MONTH', col('createdAt')), 'status'],
        order: [[literal('monthNumber'), 'ASC']],
        raw: true,
      });

      const months = [
        '',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const formattedMonthly = monthly.map((m) => ({
        month: months[m.monthNumber],
        status: m.status,
        count: m.count,
      }));

      result.monthly =
        formattedMonthly.length > 0 ? formattedMonthly : { message: messages.NOT_FOUND };
    }

    if (type === GRAPH.WEEKLY) {
      const weekly = await Order.findAll({
        attributes: [
          [fn('WEEK', col('createdAt')), 'week'],
          'status',
          [fn('COUNT', col('id')), 'count'],
        ],
        where: {
          is_deleted: false,
          createdAt: {
            [Op.between]: [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
          },
        },
        group: [fn('WEEK', col('createdAt')), 'status'],
        order: [[literal('week'), 'ASC']],
        raw: true,
      });

      result.weekly = weekly.length > 0 ? weekly : { message: messages.NOT_FOUND };
    }

    logger.info(`Order graph data fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Order graph data fetched ${messages.Is_SUCCESS}`,
      result,
      StatusCodes.OK,
    );
  } catch (error) {
    logger.error(error.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      error.message || messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

module.exports = { dashboardCounts, graphOfUser, graphOfOrder };
