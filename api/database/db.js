const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const logger = require('../logger/logger');
const messages = require('../utils/messages');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
  }
);

sequelize
  .authenticate()
  .then(() => {
    logger.info(messages.CONNECTED);
  })
  .catch((err) => {
    logger.warn(messages.CONNECTION_FAILED, err);
  });

module.exports = sequelize;
