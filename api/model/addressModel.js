const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./authModel');
const Country = require('./countryModel');
const { State } = require('./stateModel');
const { City } = require('./cityModel');

const Address = sequelize.define(
  'Address',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Country,
        key: 'id',
      },
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: State,
        key: 'id',
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: City,
        key: 'id',
      },
    },
    address_line1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_line2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip_code: {
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
    tableName: 'addresses',
  },
);

Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Address.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
Address.belongsTo(State, { foreignKey: 'state_id', as: 'state' });
Address.belongsTo(City, { foreignKey: 'city_id', as: 'city' });

module.exports = Address;
