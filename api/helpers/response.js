const { GeneralResponse } = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');

const handleResponse = (response, req, res, next) => {
  if (response instanceof GeneralResponse) {
    return res.status(StatusCodes.OK).json({
      message: response.message,
      code: response.statusCode,
      data: response.data,
    });
  }
  next(response);
};

module.exports = { handleResponse };
