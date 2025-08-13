const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const {State }= require('./stateModel');

const City = sequelize.define(
  'City',
  {
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
        model: State,
        key: 'id',
      },
    },
    city_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'cities',
  }
);

City.belongsTo(State, { foreignKey: 'state_id', as: 'state' });

module.exports = {City};
