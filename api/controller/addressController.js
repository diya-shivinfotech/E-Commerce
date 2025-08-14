const { addAddress, listOfAddress, viewAddress, updateAddress, deleteAddress } = require('../services/addressService');

module.exports ={
    addAddressController : (req,res) => {
        return addAddress(req,res);
    },
    listOfAddressController : (req,res) =>{
        return listOfAddress(req,res);
    },
    viewAddressController : (req,res) => {
        return viewAddress(req,res);
    },
    updateAddressController : (req,res) => {
        return updateAddress(req,res);
    },
    deleteAddressController : (req, res) => {
        return deleteAddress(req,res);
    }
};