const { dashboardCounts, graphOfUser, graphOfOrder } = require('../services/dashboardService');

module.exports = {
  dashboardCountsController: (req, res) => {
    return dashboardCounts(req, res);
  },
  graphOfUserController: (req, res) => {
    return graphOfUser(req, res);
  },
  graphOfOrderController: (req, res) => {
    return graphOfOrder(req, res);
  },
};
