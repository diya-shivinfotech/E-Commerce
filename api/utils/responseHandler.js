const logger = require('../logger/logger');

class GeneralResponse {
  constructor({ message, statusCode = 200, data = null }) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

const success = (res, message = 'Success', data = null, statusCode = 200) => {
  logger.info(message);
  const response = new GeneralResponse({
    message,
    statusCode,
    data,
  });
  return res.status(statusCode).json(response);
};

const error = (res, message = 'Something went wrong', statusCode = 400, errorObj = null) => {
  logger.error(message, errorObj || '');
  const response = new GeneralResponse({
    message,
    statusCode,
    data: null,
  });
  return res.status(statusCode).json(response);
};

module.exports = {
  success,
  error,
};
