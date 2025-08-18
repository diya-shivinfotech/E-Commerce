const { NOT } = require('sequelize/lib/deferrable');

const ROLE = {
  USER: 'User',
  ADMIN: 'Admin',
};

const STATUS = {
  ACTIVE: 'Active',
  DEACTIVE: 'Deactive',
};

const status = {
  AVAILABLE: 'Available',
  NOT_AVAILABLE: 'Not Available ',
};

module.exports = { ROLE, STATUS, status };
