const  Address  = require('../model/addressModel'); 
const User = require('../model/authModel');
const {City} = require('../model/cityModel');
const {State }= require('../model/stateModel');
const Country = require('../model/countryModel')
const logger = require('../logger/logger');
const responseHandler = require('../utils/responseHandler');
const { StatusCodes } = require('http-status-codes');
const messages = require('../utils/messages');
const { addressValidation, updateAddressValidation } = require('../validation/addressValidation');
const { getPaginationParams, formatPaginationResult } = require('../utils/paginationHelper');

const addAddress = async (req, res) => {
  try {

    const { error } = addressValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { country_id, state_id, city_id, address_line1, address_line2, zip_code } = req.body;

    const user_id = req.user.id;

    await Address.create({
      user_id,
      country_id,
      state_id,
      city_id,
      address_line1,
      address_line2,
      zip_code,
    });

    logger.info(`Address added ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Address added ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.CREATED
    );
  } catch (err) {
    logger.error(err.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const listOfAddress = async (req, res) => {
  try {
    const searchableFields = [
      'address_line1',
      'zip_code',
      '$user.name$',
      '$country.country_name$',
      '$state.state_name$',
      '$city.city_name$',
    ];

    const { page, limit, skip, sort, filter } = getPaginationParams(req.body, searchableFields);

    const combinedFilter = {
      ...filter,
      is_deleted: false,
    };

    const { count: totalCount, rows: addresses } = await Address.findAndCountAll({
      where: combinedFilter,
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: User, as: 'user', attributes: ['name'], required: false },
        { model: Country, as: 'country', attributes: ['country_name'], required: false },
        { model: State, as: 'state', attributes: ['state_name'], required: false },
        { model: City, as: 'city', attributes: ['city_name'], required: false },
      ],
      order: [sort],
      offset: skip,
      limit,
      raw: true, 
      nest: true 
    });

    if (totalCount === 0) {
      logger.info(`List ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `List ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const paginatedData = formatPaginationResult(totalCount, page, limit, addresses);

    logger.info(`Address list fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Address list fetched ${messages.Is_SUCCESS}`,
      paginatedData,
      StatusCodes.OK
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const viewAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; 
    const address = await Address.findOne({
      where: {
        id,
        user_id,
        is_deleted: false,
      },
      attributes: { exclude: ['is_deleted', 'createdAt', 'updatedAt'] },
      include: [
        { model: User, as: 'user', attributes: ['name'], required: false },
        { model: Country, as: 'country', attributes: ['country_name'], required: false },
        { model: State, as: 'state', attributes: ['state_name'], required: false },
        { model: City, as: 'city', attributes: ['city_name'], required: false },
      ],
      raw: true,
      nest: true
    });

    if (!address) {
      logger.info(`Address ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Address ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`Address details fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Address details fetched ${messages.Is_SUCCESS}`,
      address,
      StatusCodes.OK
    );
  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const updateAddress = async (req, res) => {
  try {

    const { error } = updateAddressValidation.validate(req.body);

    if (error) {
      logger.warn(`Validation Error: ${error.details[0].message}`);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const id = req.params.id;
    const user_id = req.user.id; 

    const addressExists = await Address.findOne({
      where: {
        id,
        user_id, 
        is_deleted: false
      }
    });

    if (!addressExists) {
      logger.warn(`Address ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Address ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    await Address.update(req.body, {
      where: {
        id
      }
    });

    logger.info(`Address updated ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Address updated ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.ACCEPTED
    );

  } catch (err) {
    logger.error(`${messages.SOMETHING_WENT_WRONG}: ${err.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteAddress = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const address = await Address.findOne({
      where: {
        id,
        is_deleted: false
      }
    });

    if (!address) {
      logger.warn(`Address ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `Address ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    await Address.update(
      { is_deleted: true },
      { where: { id } }
    );

    logger.info(`Address deleted ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Address deleted ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.OK
    );

  } catch (err) {
    logger.error(err.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { addAddress, listOfAddress, viewAddress, updateAddress, deleteAddress };
