const bcrypt = require('bcrypt');
const User = require('../model/authModel');
const { StatusCodes } = require('http-status-codes');
const responseHandler = require('../utils/responseHandler');
const logger = require('../logger/logger');
const messages = require('../utils/messages');
const {userValidation ,loginValidation, changePasswordValidation, resetPasswordSchema} = require('../validation/authValidation');
const { generateToken } = require('../middleware/verifyToken.js');
const {STATUS} = require('../utils/enums.js');
const generateOtp = require('../utils/generatOtp.js');
const emailOtp = require('../model/otp.js');
const sendMail = require('../utils/nodemailer.js');

const registerUser = async (req, res) => {
  try {
    const { error } = userValidation.validate(req.body);

    if (error) {
      logger.warn(error.details[0].message);
      return responseHandler.error(
        res,
        error.details[0].message,
        StatusCodes.BAD_REQUEST
      );
    }

    const {
      name,
      email,
      password,
      phone_number,
      profile_image,
      status,
      role,
    } = req.body;

    const imageUpload = req.file ? req.file.filename : profile_image || null;

    const emailExists = await User.findOne({ where: { email } });

    if (emailExists) {
      logger.warn(`Email ${messages.ALREADY_EXISTS}`);
      return responseHandler.error(
        res,
        `Email ${messages.ALREADY_EXISTS}`,
        StatusCodes.CONFLICT
      );
    }

    const phoneExists = await User.findOne({ where: { phone_number } });
    if (phoneExists) {
      logger.warn(`Phone number ${messages.ALREADY_EXISTS}`);
      return responseHandler.error(
        res,
        `Phone number ${messages.ALREADY_EXISTS}`,
        StatusCodes.CONFLICT
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      profile_image: imageUpload,
      status,
      role,
    });

    logger.info(`Registered ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Registered ${messages.Is_SUCCESS}`,
      StatusCodes.CREATED
    );
  } catch (err) {
    logger.error(err.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const loginUser = async (req, res) => {
  try {

    const { error } = loginValidation.validate(req.body);

    if (error) {
      logger.warn(error.details[0].message);
      return responseHandler.error(
        res,
        error.details[0].message,
        StatusCodes.BAD_REQUEST
      );
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn(`Email ${messages.IS_INVALID}`);
      return responseHandler.error(
        res,
        `Email ${messages.IS_INVALID}`,
        StatusCodes.UNAUTHORIZED
      );
    }

    if (user.status !== STATUS.ACTIVE) {
      logger.warn(`Email ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `Email ${messages.NOT_FOUND}`,
        StatusCodes.FORBIDDEN
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      logger.warn(`Password ${messages.IS_INCORRECT}`);
      return responseHandler.error(
        res,
        `Password ${messages.IS_INCORRECT}`,
        StatusCodes.UNAUTHORIZED
      );
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role, });

    logger.info(messages.LOGIN_SUCCESS);
    return responseHandler.success(
      res,
      messages.LOGIN_SUCCESS,
      { token },
      StatusCodes.OK
    );
  } catch (err) {
    logger.error(err.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const viewProfile = async (req, res) => {
  try {
    const email = req.user.email;

    const result = await User.findOne({
      attributes: [
        'name',
        'email',
        'phone_number',
        'profile_image',
        'status',
        'role',
      ],
      where: { email, status: STATUS.ACTIVE },
    });

    if (!result) {
      logger.warn(`User ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `User ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND
      );
    }

    logger.info(`Profile fetched ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Profile fetched ${messages.Is_SUCCESS}`,
      result,
      StatusCodes.OK
    );

  } catch (error) {
    logger.error(`Error fetching profile: ${error.message}`);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile_image = req.file ? req.file.filename : null;

    const user = await User.findOne({
      where: { id: userId, status: STATUS.ACTIVE },
    });

    if (!user) {
      logger.warn(`User ${messages.NOT_FOUND}`);
      return responseHandler.error(
        res,
        `User ${messages.NOT_FOUND}`,
        StatusCodes.NOT_FOUND
      );
    }

    Object.assign(user, req.body);

    if (profile_image) {
      user.profile_image = profile_image;
    }

    await user.save();

    logger.info(`User profile ${messages.UPDATED_SUCCESS}`);
    return responseHandler.success(
      res,
      `User profile ${messages.UPDATED_SUCCESS}`,
      undefined,
      StatusCodes.ACCEPTED
    );
  } catch (error) {
    logger.error(error.message || messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const changePassword = async (req, res) => {
  try {
    const { error } = changePasswordValidation.validate(req.body);

    if (error) {
      logger.warn(error.details[0].message);
      return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
    }

    const { old_password, new_password } = req.body;
    const email = req.user.email;

    const user = await User.findOne({ where : { email, status: STATUS.ACTIVE } });

    if (!user) {
      logger.warn(`User ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `User ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(old_password, user.password);

    if (!isMatch) {
      logger.warn(`Old password ${messages.IS_INCORRECT}`);
      return responseHandler.error(
        res,
        `Old password ${messages.IS_INCORRECT}`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    logger.info(`Password changed ${messages.Is_SUCCESS}`);
    return responseHandler.success(res, `Password changed ${messages.Is_SUCCESS}`, StatusCodes.OK);
  } catch {
    logger.warn(messages.SOMETHING_WENT_WRONG);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

const verifyEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return responseHandler.error(
      res,
      `Email ${messages.FIELD_REQUIRED}`,
      StatusCodes.BAD_REQUEST
    );
  }

  const otp = generateOtp();

  try {

    await emailOtp.create({ email, otp });
    await sendMail(email, otp);

    return responseHandler.success(
      res,
      messages.VERIFICATION_CODE,
      null,
      StatusCodes.OK
    );
  } catch (error) {
    logger.error('Error sending email:', error);
    return responseHandler.error(
      res,
      messages.EMAIL_SEND_FAILED,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const resetPassword = async (req, res) => {

  const { error } = resetPasswordSchema.validate(req.body);

  if (error) {
    logger.warn(error.details[0].message);
    return responseHandler.error(res, error.details[0].message, StatusCodes.BAD_REQUEST);
  }

  const { email, otp, new_password } = req.body;

  try {

    const user = await User.findOne({
      where: { email, status: STATUS.ACTIVE }
    });

    if (!user) {
      logger.warn(`User ${messages.NOT_FOUND}`);
      return responseHandler.error(res, `User ${messages.NOT_FOUND}`, StatusCodes.NOT_FOUND);
    }

    const otpRecord = await emailOtp.findOne({
      where: { email, otp },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      logger.warn(messages.CODE_INVALID);
      return responseHandler.error(res, messages.CODE_INVALID ,StatusCodes.UNAUTHORIZED);
    }

    const createdAt = otpRecord.createdAt;
    const currentTime = new Date();
    const expiryTime = 1 * 60 * 1000;

    if (currentTime - createdAt > expiryTime) {
      logger.warn(messages.OTP_EXPIRED);
      return responseHandler.error(res, messages.OTP_EXPIRED, StatusCodes.UNAUTHORIZED);
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    await emailOtp.destroy({
      where: { email }
    });

    logger.info(`Password reset ${messages.Is_SUCCESS}`);
    return responseHandler.success(
      res,
      `Password reset ${messages.Is_SUCCESS}`,
      null,
      StatusCodes.ACCEPTED
    );

  } catch (err) {
    logger.warn(messages.SOMETHING_WENT_WRONG, err);
    return responseHandler.error(
      res,
      messages.SOMETHING_WENT_WRONG,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};


module.exports = { registerUser, loginUser, viewProfile, editProfile, changePassword, verifyEmail, resetPassword };
