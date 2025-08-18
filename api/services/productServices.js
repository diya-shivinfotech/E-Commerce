const subCategory = require('../model/subCategoryModel');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { productValidation } = require('../validation/productValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');
const Product = require('../model/productModel');

const addProduct = async (req, res) => {
  try {
    const { error } = productValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { subCategory_id, name, description } = req.body;

    const existingProduct = await Product.findOne({
      where: { name },
    });

    if (existingProduct) {
      logger.warn(`Product ${messages.ALREADY_EXISTS}`);
      return responseHandler.error(res, `Product ${messages.ALREADY_EXISTS}`, StatusCodes.CONFLICT);
    }

    await Product.create({
      subCategory_id,
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

module.exports = {
  addProduct,
};
