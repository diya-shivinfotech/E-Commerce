const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const { Status } = require('../utils/enums');
const User = require('./authModel');
const Address = require('./addressModel');
const ProductVariant = require('./productVariantModel');

const Order = sequelize.define(
  'Order',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Address,
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
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(Status.PROGRESS, Status.DELIVERED, Status.CANCELLED),
      defaultValue: Status.PROGRESS,
    },
    shipping_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billing_address: {
      type: DataTypes.STRING,
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
    tableName: 'orders',
  },
);

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });
Order.belongsTo(ProductVariant, { foreignKey: 'product_variant_id', as: 'product_variant' });

module.exports = Order;
