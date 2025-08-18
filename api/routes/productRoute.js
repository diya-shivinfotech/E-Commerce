const express = require('express');
const router = express.Router();
const { ROLE } = require('../utils/enums');
const { verifyToken } = require('../middleware/verifyToken');
const { addProductController } = require('../controller/productController');

router.post('/addProduct', verifyToken([ROLE.ADMIN]), addProductController);

module.exports = router;
