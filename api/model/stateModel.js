const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Country = require('./countryModel');

const State = sequelize.define(
  'State',
  {
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
        model: Country,
        key: 'id',
      },
    },
    state_name: {
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
    tableName: 'states',
  }
);

State.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });

module.exports = {State};
