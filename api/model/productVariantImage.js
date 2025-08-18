const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const productVariant = require('./productVariantModel');

const productVariantImage = sequelize.define(
  'productVariantImage',
  {
    productVariant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: productVariant,
        key: 'id',
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'productVariantImages',
  },
);
productVariant.hasMany(productVariantImage, {
  foreignKey: 'productVariant_id',
  as: 'images',
});

productVariantImage.belongsTo(productVariant, {
  foreignKey: 'productVariant_id',
  as: 'productVariant',
});

module.exports = productVariantImage;
