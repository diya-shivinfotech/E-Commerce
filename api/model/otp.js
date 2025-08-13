const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const emailOtp = sequelize.define(
  'EmailOtp',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'email_otps',
    timestamps: true,
  }
);

module.exports = emailOtp;
