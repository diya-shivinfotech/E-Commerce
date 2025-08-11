const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/messages');
const { StatusCodes } = require('http-status-codes');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const verifyToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(messages.INVALID_AUTH_HEADER);
      return responseHandler.error(res, messages.INVALID_AUTH_HEADER, StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      logger.warn(`Authorization ${messages.TOKEN_MISSING}`);
      return responseHandler.error(
        res,
        `Authorization ${messages.TOKEN_MISSING}`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        logger.warn(messages.ACCESS_DENIED);
        return responseHandler.error(res, messages.ACCESS_DENIED, StatusCodes.FORBIDDEN);
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      logger.info(`Token verified ${messages.Is_SUCCESS}`);
      next();
    } catch (err) {
      logger.error(`${messages.INVALID_OR_EXPIRED_TOKEN}: ${err.message}`);
      return responseHandler.error(
        res,
        messages.INVALID_OR_EXPIRED_TOKEN,
        StatusCodes.UNAUTHORIZED,
      );
    }
  };
};

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { verifyToken, generateToken };
