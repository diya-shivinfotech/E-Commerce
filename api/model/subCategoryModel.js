const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const Category = require('./categoryModel');

const subCategory = sequelize.define(
  'subCategory',
  {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
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
    tableName: 'subCategories',
  },
);

subCategory.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
module.exports = subCategory;
