const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Product = require('./productModel');
const Order = require('./orderModel');

const orderItem = sequelize.define(
  'orderItem',
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'orderItems',
  },
);


orderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
orderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = orderItem;