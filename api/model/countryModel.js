const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Country = sequelize.define(
  'Country',
  {
    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'countries',
  },
);

module.exports = Country;
