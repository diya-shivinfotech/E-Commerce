const express = require('express');
const router = express.Router();
const authRoute = require('./authRoute');
const locationRoute = require('./locationRoute');
const addressRoute = require('./addressRoute');
const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const productRoute = require('./productRoute');

router.use('/auth', authRoute);
router.use('/location', locationRoute);
router.use('/address', addressRoute);
router.use('/category', categoryRoute);
router.use('/subCategory', subCategoryRoute);
router.use('/product',productRoute);

module.exports = router;
