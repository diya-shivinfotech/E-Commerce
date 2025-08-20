const {
  addOrderItem,
  listOfOrderItem,
  viewOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require('../services/orderItemServices');

module.exports = {
  addOrderItemController: (req, res) => {
    return addOrderItem(req, res);
  },
  listOfOrderItemController: (req, res) => {
    return listOfOrderItem(req, res);
  },
  viewOrderItemController: (req, res) => {
    return viewOrderItem(req, res);
  },
  updateOrderItemController: (req, res) => {
    return updateOrderItem(req, res);
  },
  deleteOrderItemController: (req, res) => {
    return deleteOrderItem(req, res);
  },
};
