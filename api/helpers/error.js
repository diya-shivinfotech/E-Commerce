const { GeneralError } = require('../utils/error');
const { StatusCodes } = require('http-status-codes');
const { RESPONSE_STATUS } = require('../utils/enum');
const { Messages } = require('../utils/messages');
const logger = require('../logger/logger');
let statusToSet = 400;

const handleErrors = (err, req, res) => {
  if (err instanceof GeneralError) {
    return res.status(err.statusCode !== '' ? err.statusCode : err.getCode()).json({
      message: err.message,
      code: err.statusCode !== '' ? err.statusCode : err.getCode(),
      result: err.result !== '' ? err.data : undefined,
      status: err.status,
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: err.status,
    code: err.statusCode !== '' ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
};

const handleJoiErrors = (err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    logger.error(err.error);
    const customErrorResponse = {};
    if (err.error.details.length !== 0) {
      err.error.details.forEach((item) => {
        customErrorResponse[`${item.context.key}`] = {
          message: item.message,
          context: item.context.label,
          type: item.type,
        };
      });
    }
    res.status(statusToSet).json({
      status: 'error',
      code: StatusCodes.BAD_REQUEST,
      message: 'Validation Error',
      data: customErrorResponse,
    });
    res.status(StatusCodes.BAD_REQUEST).send(customErrorResponse);
  } else {
    next(err);
  }
};

const errorHandler = (check) => {
  return async (req, res, next) => {
    try {
      await check(req, res, next);
    } catch (error) {
      logger.error(error);
      next(
        new GeneralError(
          Messages.INTERNAL_SERVER_ERROR,
          StatusCodes.INTERNAL_SERVER_ERROR,
          undefined,
          RESPONSE_STATUS.ERROR,
        ),
      );
    }
  };
};

module.exports = { handleErrors, handleJoiErrors, errorHandler };
