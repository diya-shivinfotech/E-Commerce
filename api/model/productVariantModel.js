const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const { status } = require('../utils/enums');
const Product = require('./productModel');
const Category = require('./categoryModel');
const subCategory = require('./subCategoryModel');

const productVariant = sequelize.define(
  'productVariant',
  {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
    subCategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: subCategory,
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    style: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(status.AVAILABLE, status.NOT_AVAILABLE),
      allowNull: false,
      defaultValue: status.AVAILABLE,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'productVariants',
  },
);

productVariant.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
productVariant.belongsTo(subCategory, { foreignKey: 'subCategory_id', as: 'subcategory' });
productVariant.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = productVariant;
