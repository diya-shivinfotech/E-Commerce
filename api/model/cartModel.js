const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./authModel');
const productVariant = require('./productVariantModel');

const Cart = sequelize.define(
  'Cart',
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
    quantity: {
      type: DataTypes.INTEGER,
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
    tableName: 'carts',
  },
);

Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Cart.belongsTo(productVariant, { foreignKey: 'product_variant_id', as: 'product_variant' });

module.exports = Cart;
