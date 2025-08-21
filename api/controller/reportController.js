const { listUsers, listOrders } = require('../services/reportService');

module.exports = {
  listUsersController: (req, res) => {
    return listUsers(req, res);
  },
  listOrdersController: (req, res) => {
    return listOrders(req, res);
  },
};
