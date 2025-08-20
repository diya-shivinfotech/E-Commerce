const express = require('express');
const router = express.Router();
const authRoute = require('./authRoute');
const locationRoute = require('./locationRoute');
const addressRoute = require('./addressRoute');
const categoryRoute = require('./categoryRoute');
const subCategoryRoute = require('./subCategoryRoute');
const productRoute = require('./productRoute');
const productVariantRoute = require('./productVariantRoute');
const orderRoute = require('./orderRoute');
const orderItemRoute = require('./orderItemRoute');
const cartRoute = require('./cartRoute');
const cartItemRoute = require('./cartItemRoute');
const wishlistRoute = require('./wishlistRoute');

router.use('/auth', authRoute);
router.use('/location', locationRoute);
router.use('/address', addressRoute);
router.use('/category', categoryRoute);
router.use('/subCategory', subCategoryRoute);
router.use('/product', productRoute);
router.use('/productVariant', productVariantRoute);
router.use('/order', orderRoute);
router.use('/orderItem', orderItemRoute);
router.use('/cart', cartRoute);
router.use('/cartItem', cartItemRoute);
router.use('/wishlist', wishlistRoute);

module.exports = router;
