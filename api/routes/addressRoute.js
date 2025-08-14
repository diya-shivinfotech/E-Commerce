const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const {
  addAddressController,
  listOfAddressController,
  viewAddressController,
  updateAddressController,
  deleteAddressController,
} = require('../controller/addressController');

router.post('/addAddress', verifyToken([ROLE.USER]), addAddressController);
router.post('/listOfAddress', verifyToken([ROLE.USER, ROLE.ADMIN]), listOfAddressController);
router.get('/viewAddress/:id', verifyToken([ROLE.USER, ROLE.ADMIN]), viewAddressController);
router.put('/updateAddress/:id', verifyToken([ROLE.USER]), updateAddressController);
router.delete('/deleteAddress/:id', verifyToken([ROLE.USER]), deleteAddressController);

module.exports = router;
