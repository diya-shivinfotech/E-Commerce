const express = require('express');
const router = express.Router();
const locationController = require('../controller/locationController');

router.get('/listOfCountries', locationController.listOfCountriesController);
router.post('/listOfStates', locationController.listOfStatesController);
router.post('/listOfCities', locationController.listOfCitiesController);

module.exports = router;
