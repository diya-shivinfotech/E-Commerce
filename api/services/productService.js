const subCategory = require('../model/subCategoryModel');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { productValidation, updateProductValidation } = require('../validation/productValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Product = require('../model/productModel');

const addProduct = async (req, res) => {
  try {
    const { error } = productValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { sub_category_id, name, description } = req.body;

    await Product.create({
      sub_category_id,
      name,
      description,
    });

    logger.info(`Product added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product added ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.CREATED,
    );
  } catch (err) {
    logger.error(err.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const listOfProduct = async (req, res) => {
  try {
    const searchableFields = ['name', '$subcategory.name$'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await Product.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [{ model: subCategory, as: 'subcategory', attributes: ['name'], required: false }],
      order: [sort],
      offset: skip,
      limit,
      raw: true,
      nest: true,
    });

    if (totalCount === 0) {
      logger.info(`List ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `List ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const paginatedData = formatPaginationResult(totalCount, page, limit, addresses);

    logger.info(`Product list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product list fetched ${messages.Is_SUCCESS}`,
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

const viewProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [{ model: subCategory, as: 'subcategory', attributes: ['name'], required: false }],
      raw: true,
      nest: true,
    });

    if (!product) {
      logger.info(`Product ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Product ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Product details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product details fetched ${messages.Is_SUCCESS}`,
      product,
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

const updateProduct = async (req, res) => {
  try {
    const { error } = updateProductValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;

    const product = await Product.update(req.body, {
      where: {
        id,
        is_deleted: false,
      },
    });

    if (product == 0) {
      logger.warn(`Product ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Product ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Product updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product updated ${messages.Is_SUCCESS}`,
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

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (product == 0) {
      logger.warn(`Product ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Product ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Product deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Product deleted ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.ACCEPTED,
    );
  } catch (err) {
    logger.error(err.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

module.exports = {
  addProduct,
  listOfProduct,
  viewProduct,
  updateProduct,
  deleteProduct,
};
