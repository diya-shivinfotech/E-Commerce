const { StatusCodes } = require('http-status-codes');
const logger = require('../logger/logger');

class GeneralError extends Error {
  constructor(message, statusCode = '', data = '', status) {
    logger.info(message);
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.status = status;
  }
  getCode() {
    if (this instanceof BadRequest) {
      return StatusCodes.BAD_REQUEST;
    } else if (this instanceof NotFound) {
      return StatusCodes.NOT_FOUND;
    } else if (this instanceof UnAuthorized) {
      return StatusCodes.UNAUTHORIZED;
    } else if (this instanceof ServiceNotAvailable) {
      return StatusCodes.INTERNAL_SERVER_ERROR;
    }
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class UnAuthorized extends GeneralError {}
class ServiceNotAvailable extends GeneralError {}

module.exports = {
  GeneralError,
  BadRequest,
  NotFound,
  UnAuthorized,
  ServiceNotAvailable,
};
