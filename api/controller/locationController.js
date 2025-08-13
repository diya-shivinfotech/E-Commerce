const { listOfCountries, listOfStates, listOfCities } = require('../services/locationService');

module.exports = {
    listOfCountriesController: (req, res) => {
        return listOfCountries(req, res);
    },
     listOfStatesController: (req, res) => {
        return listOfStates(req, res);
    },
    listOfCitiesController: (req,res) => {
        return listOfCities(req,res);
    }
};