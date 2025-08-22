const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Order = require('./orderModel');
const ProductVariant = require('./productVariantModel');

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
    product_variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductVariant,
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
orderItem.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'product_variant' });

module.exports = orderItem;
