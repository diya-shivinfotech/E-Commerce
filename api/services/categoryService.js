const Category = require('../model/categoryModel');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const {
  categoryValidation,
  updateCategoryValidation,
} = require('../validation/categoryValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');

const addCategory = async (req, res) => {
  try {
    const { error } = categoryValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      logger.warn(`Category name ${messages.ALREADY_EXISTS}`);
      return responseHandler.error(
        res,
        `Category name ${messages.ALREADY_EXISTS}`,
        StatusCodes.CONFLICT,
      );
    }

    await Category.create({
      name,
      image,
    });

    logger.info(`Category added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Category added ${messages.Is_SUCCESS}`,
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

const listOfCategory = async (req, res) => {
  try {
    const searchableFields = ['name'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const { count: totalCount, rows: categories } = await Category.findAndCountAll({
      where: filter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      order: [sort],
      offset: skip,
      limit,
    });

    if (totalCount === 0) {
      logger.info(`Category list ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Category list ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
      );
    }

    const paginatedData = formatPaginationResult(totalCount, page, limit, categories);

    logger.info(`Category list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Category list fetched ${messages.Is_SUCCESS}`,
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

const viewCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      where: {
        id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
    });

    if (!category) {
      logger.info(`Category ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Category  ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Category details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Category  details fetched ${messages.Is_SUCCESS}`,
      category,
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

const updateCategory = async (req, res) => {
  try {
    const { error } = updateCategoryValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;

    const category = await Category.update(req.body, {
      where: {
        id,
        is_deleted: false,
      },
    });

    if (category == 0) {
      logger.warn(`Category ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Category ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Category updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Category updated ${messages.Is_SUCCESS}`,
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

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (category == 0) {
      logger.warn(`Category ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Category ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Category deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Category deleted ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.OK,
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
  addCategory,
  listOfCategory,
  viewCategory,
  updateCategory,
  deleteCategory,
};
