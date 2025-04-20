const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { notificationService } = require("../services");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const { sendAdminMessage } = require("../services/email.service");
const { sendNotification } = require("../services/notification.service");

const AllNotification = catchAsync(async (req, res) => {
  const { id, role } = req.user;
  const { page, limit } = req.query;
  const data = await notificationService.getAllNotification(
    id,
    role,
    page,
    limit
  );

  res.status(httpStatus.OK).json(
    response({
      message: "notification retrieved success",
      status: "notification",
      statusCode: httpStatus.OK,
      data: data,
    })
  );
});

const SendMailToUser = catchAsync(async (req, res) => {
  const { title, message, userId } = req.body;
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "provide user id !");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "user not found !");
  }


  const notification = {
    userId:user._id,
    role:"user",
    title:title,
    content:message
  }

  await sendAdminMessage(user.email, title, message);
  await sendNotification(user._id ,notification)


  res.status(httpStatus.OK).json(
    response({
      message: "message send success ",
      status: "okay",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

module.exports = {
  AllNotification,
  SendMailToUser,
};
