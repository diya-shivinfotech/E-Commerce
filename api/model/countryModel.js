const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Country = sequelize.define(
  'Country',
  {
    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'countries',
  }
);

module.exports = Country;
