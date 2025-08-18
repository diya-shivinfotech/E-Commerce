const subCategory = require('../model/subCategoryModel');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const {
  subCategoryValidation,
  updatesubCategoryValidation,
} = require('../validation/subCategoryValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Category = require('../model/categoryModel');

const addsubCategory = async (req, res) => {
  try {
    const { error } = subCategoryValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { category_id, name } = req.body;

    const existingCategory = await subCategory.findOne({
      where: { name },
    });

    if (existingCategory) {
      logger.warn(`Sub category name ${messages.ALREADY_EXISTS}`);
      return responseHandler.error(
        res,
        `Sub category name ${messages.ALREADY_EXISTS}`,
        StatusCodes.CONFLICT,
      );
    }

    await subCategory.create({
      category_id,
      name,
    });

    logger.info(`Sub-Category added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Sub-Category added ${messages.Is_SUCCESS}`,
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

const listOfsubCategory = async (req, res) => {
  try {
    const searchableFields = ['name', '$category.name$'];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await subCategory.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [{ model: Category, as: 'category', attributes: ['name'], required: false }],
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

    logger.info(`Sub-category list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Sub-category list fetched ${messages.Is_SUCCESS}`,
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

const viewsubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await subCategory.findOne({
      where: {
        id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [{ model: Category, as: 'category', attributes: ['name'], required: false }],
      raw: true,
      nest: true,
    });

    if (!subcategory) {
      logger.info(`Sub-category ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Sub-category ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
      );
    }

    logger.info(`Sub-category details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Sub-category details fetched ${messages.Is_SUCCESS}`,
      subcategory,
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

const updatesubCategory = async (req, res) => {
  try {
    const { error } = updatesubCategoryValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;

    const subcategory = await subCategory.update(req.body, {
      where: {
        id,
        is_deleted: false,
      },
    });

    if (subcategory == 0) {
      logger.warn(`Sub-category ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Sub-category ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND,
      );
    }

    logger.info(`Sub-category updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Sub-category updated ${messages.Is_SUCCESS}`,
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

const deletesubCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const subcategory = await subCategory.update(
      { is_deleted: true },
      { where: { id, is_deleted: false } },
    );

    if (subcategory == 0) {
      logger.warn(`Sub-category ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Sub-category${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Sub-category deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Sub-category deleted ${messages.Is_SUCCESS}`,
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
  addsubCategory,
  listOfsubCategory,
  viewsubCategory,
  updatesubCategory,
  deletesubCategory,
};
