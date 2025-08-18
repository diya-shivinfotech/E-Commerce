const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const subCategory = require('./subCategoryModel');

const Product = sequelize.define(
  'Product ',
  {
    subCategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: subCategory,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'products',
  },
);

Product.belongsTo(subCategory, { foreignKey: 'subCategory_id', as: 'subcategory' });

module.exports = Product;
