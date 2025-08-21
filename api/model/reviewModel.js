const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./authModel');
const productVariant = require('./productVariantModel');

const Review = sequelize.define(
  'Review',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    product_variant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: productVariant,
        key: 'id',
      },
    },
    ratings: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
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
    tableName: 'reviews',
  },
);

Review.belongsTo(User, { foreignKey: 'user_id', as: 'review' });
Review.belongsTo(productVariant, { foreignKey: 'product_variant_id', as: 'product_variant' });

module.exports = Review;
