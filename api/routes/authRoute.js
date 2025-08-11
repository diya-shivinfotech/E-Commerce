const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const upload = require('../middleware/multer');
const { verifyToken } = require('../middleware/verifyToken');

router.post(
  '/register',
  upload.single('profile_image'),
  authController.registerController
);
router.post(
  '/login',
  authController.loginUserController
);
router.get('/viewProfile',verifyToken(),authController.viewProfileController);
router.put('/editProfile',verifyToken(),authController.editProfileController);
router.put('/changePassword',verifyToken(),authController.changePasswordController);
router.post('/verifyEmail',authController.verifyEmailController);
router.put('/resetPassword',authController.resetPasswordController);

module.exports = router;