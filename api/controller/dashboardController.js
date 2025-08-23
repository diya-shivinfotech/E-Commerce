const { dashboardCounts } = require('../services/dashboardService');

module.exports = {
  dashboardCountsController: (req, res) => {
    return dashboardCounts(req, res);
  },
};
