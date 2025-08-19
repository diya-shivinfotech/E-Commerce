const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const subCategory = require('./subCategoryModel');

const Product = sequelize.define(
  'Product',
  {
    sub_category_id: {
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

<<<<<<< HEAD
Product.belongsTo(subCategory, { foreignKey: 'subCategory_id', as: 'subcategory' });
=======
Product.belongsTo(subCategory, { foreignKey: 'sub_category_id', as: 'subcategory' });
>>>>>>> a91267be9199c3ffff6e22b33dcc7514c5c36be8

module.exports = Product;
