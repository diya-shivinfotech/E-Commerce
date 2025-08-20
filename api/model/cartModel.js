const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./authModel');

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
    total_amount: {
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
    tableName: 'carts',
  },
);

Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Cart;
