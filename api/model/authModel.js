const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const { ROLE, STATUS } = require('../utils/enums');

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(STATUS.ACTIVE, STATUS.DEACTIVE),
      allowNull: false,
      defaultValue: STATUS.ACTIVE,
    },
    role: {
      type: DataTypes.ENUM(ROLE.USER, ROLE.ADMIN),
      allowNull: false,
      defaultValue: ROLE.USER,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
  },
  {
    timestamps: true,
    tableName: 'users',
  },
);

module.exports = User;
