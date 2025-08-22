const {
  addOrder,
  listOfOrder,
  viewOrder,
  deleteOrder,
  updateOrderDetails,
  updateOrderStatus,
} = require('../services/orderService');

module.exports = {
  addOrderController: (req, res) => {
    return addOrder(req, res);
  },
  listOfOrderController: (req, res) => {
    return listOfOrder(req, res);
  },
  viewOrderController: (req, res) => {
    return viewOrder(req, res);
  },
  deleteOrderController: (req, res) => {
    return deleteOrder(req, res);
  },
  updateOrderDetailsController: (req, res) => {
    return updateOrderDetails(req, res);
  },
  updateOrderStatusController: (req, res) => {
    return updateOrderStatus(req, res);
  },
};
