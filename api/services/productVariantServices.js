const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const {
  addProductVariantValidation,
  updateProductVariantValidation,
} = require('../validation/productVariantValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Product = require('../model/productModel');
const Category = require('../model/categoryModel');
const subCategory = require('../model/subCategoryModel');
const productVariant = require('../model/productVariantModel');
const productVariantImage = require('../model/productVariantImage');

const addProductVariant = async (req, res) => {
  try {
    const { error } = addProductVariantValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const {
      category_id,
      subCategory_id,
      product_id,
      color,
      size,
      material,
      style,
      price,
      quantity,
      status,
    } = req.body;

    const image = req.file ? req.file.path : null;

    const createdVariant = await productVariant.create({
      category_id,
      subCategory_id,
      product_id,
      color,
      size,
      material,
      style,
      price,
      quantity,
      status,
    });

    if (createdVariant) {
      if (image) {
        await productVariantImage.create({
          productVariant_id: createdVariant.id,
          image,
        });
      }
    }

    logger.info(`Product Variant added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product Variant added ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.CREATED,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const listOfProductVariant = async (req, res) => {
  try {
    const searchableFields = [
      '$product.name$',
      '$category.name$',
      '$subcategory.name$',
      'color',
      'size',
      'style',
      'material',
    ];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: variants } = await productVariant.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: Product, as: 'product', attributes: ['name'], required: false },
        { model: Category, as: 'category', attributes: ['name'], required: false },
        { model: subCategory, as: 'subcategory', attributes: ['name'], required: false },
        {
          model: productVariantImage,
          as: 'images',
          attributes: ['image'],
          required: false,
        },
      ],
      order: [sort],
      offset: skip,
      limit,
      nest: true,
      subQuery: false,
      distinct: true,
    });

    if (totalCount === 0) {
      logger.info(`Product Variant list ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Product Variant list ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
      );
    }

    const paginatedData = formatPaginationResult(totalCount, page, limit, variants);

    logger.info(`Product Variant list fetched ${messages.IS_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product Variant list fetched ${messages.IS_SUCCESS}`,
      paginatedData,
      StatusCodes.OK,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const viewProductVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await productVariant.findOne({
      where: {
        id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: Product, as: 'product', attributes: ['name'], required: false },
        { model: Category, as: 'category', attributes: ['name'], required: false },
        { model: subCategory, as: 'subcategory', attributes: ['name'], required: false },
        { model: productVariantImage, as: 'images', attributes: ['image'], required: false },
      ],
      raw: true,
      nest: true,
    });

    if (!variant) {
      logger.info(`Product Variant ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Product Variant ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
      );
    }

    logger.info(`Product Variant details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product Variant details fetched ${messages.Is_SUCCESS}`,
      variant,
      StatusCodes.OK,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const updateProductVariant = async (req, res) => {
  try {
    const { error } = updateProductVariantValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;
    const variant = await productVariant.findOne({ where: { id, is_deleted: false } });

    if (!variant) {
      logger.warn(`Product Variant ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Product Variant ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
      );
    }

    if (Object.keys(req.body).length > 0) {
      await productVariant.update(req.body, { where: { id } });
    }

    logger.info(`Product Variant updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product Variant updated ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.ACCEPTED,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const deleteProductVariant = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedVariant = await productVariant.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (deletedVariant == 0) {
      logger.warn(`Product Variant ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Product Variant ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
      );
    }

    logger.info(`Product Variant deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product Variant deleted ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.OK,
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

module.exports = {
  addProductVariant,
  listOfProductVariant,
  viewProductVariant,
  updateProductVariant,
  deleteProductVariant,
};
