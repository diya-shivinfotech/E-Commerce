const { StatusCodes } = require('http-status-codes');
const Country = require('../model/countryModel');
const { State } = require('../model/stateModel');
const { City } = require('../model/cityModel');
const responseHandler = require('../utils/responseHandler');
const messages = require('../utils/messages');
const logger = require('../logger/logger');
const { listStatesSchema, listCitiesSchema } = require('../validation/locationValidation');

const listOfCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      attributes: ['id', 'country_name'],
      order: [['country_name', 'ASC']],
    });

    logger.info(`Country fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Country fetched ${messages.Is_SUCCESS}`,
      { countries },
      StatusCodes.OK,
    );
  } catch {
    logger.warn(messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(res, messages.SOMETHING_WENT_WRONG, StatusCodes.BAD_REQUEST);
  }
};

const listOfStates = async (req, res) => {
  try {
    const { error } = listStatesSchema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      logger.error(errorMessage);
      return responseHandler.error(res, errorMessage, StatusCodes.BAD_REQUEST);
    }

    const { country_id } = req.body;

    const states = await State.findAll({
      where: {
        is_deleted: false,
        country_id: country_id,
      },
      include: [
        {
          model: Country,
          as: 'country',
          attributes: ['id', 'country_name'],
        },
      ],
      attributes: ['id', 'state_name'],
      order: [['state_name', 'ASC']],
    });

    if (!states || states.length === 0) {
      logger.info(`States ${messages.NOT_FOUND} ${country_id}`);
      return responseHandler.error(res, `States ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`States fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `States fetched ${messages.Is_SUCCESS}`,
      { states },
      StatusCodes.OK,
    );
  } catch (error) {
    logger.error(error.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const listOfCities = async (req, res) => {
  try {
    const { error } = listCitiesSchema.validate(req.body);

    if (error) {
      const errorMessage = error.details[0].message;
      logger.error(errorMessage);
      return responseHandler.error(res, errorMessage, StatusCodes.BAD_REQUEST);
    }

    const { state_id } = req.body;

    const cities = await City.findAll({
      where: {
        is_deleted: false,
        state_id : state_id ,
      },
      include: [
        {
          model: State,
          as: 'state',
          attributes: ['id', 'state_name'],
        },
      ],
      attributes: ['id', 'city_name'],
      order: [['city_name', 'ASC']],
    });

    if (!cities || cities.length === 0) {
      logger.info(`City ${messages.NOT_FOUND} ${state_id}`);
      return responseHandler.error(res, `City ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    logger.info(`City fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `City fetched ${messages.Is_SUCCESS}`,
      { cities },
      StatusCodes.OK,
    );
  } catch (error) {
    logger.error(error.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

module.exports = { listOfCountries, listOfStates, listOfCities };
