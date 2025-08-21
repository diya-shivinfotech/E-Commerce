const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Cart = require('./cartModel');
const productVariant = require('./productVariantModel');
const User = require('./authModel');

const cartItem = sequelize.define(
  'cartItem',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    product_variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: productVariant,
        key: 'id',
      },
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
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
    tableName: 'cartItems',
  },
);

cartItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
cartItem.belongsTo(productVariant, { foreignKey: 'product_variant_id', as: 'product_variant' });
cartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

module.exports = cartItem