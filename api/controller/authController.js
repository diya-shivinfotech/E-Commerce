const {
  registerUser,
  loginUser,
  viewProfile,
  editProfile,
  changePassword,
  verifyEmail,
  resetPassword,
} = require('../services/authService');

module.exports = {
  registerController: (req, res) => {
    return registerUser(req, res);
  },
  loginUserController: (req, res) => {
    return loginUser(req, res);
  },
  viewProfileController: (req, res) => {
    return viewProfile(req, res);
  },
  editProfileController: (req, res) => {
    return editProfile(req, res);
  },
  changePasswordController: (req, res) => {
    return changePassword(req, res);
  },
  verifyEmailController: (req, res) => {
    return verifyEmail(req, res);
  },
  resetPasswordController: (req, res) => {
    return resetPassword(req, res);
  },
};
