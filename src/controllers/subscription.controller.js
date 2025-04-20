const httpStatus = require("http-status");
const {
  createSubscription,
  allSubscription,
  singleSubscription,
  updateSubscription,
  deleteSubscription,
  restoreSubscription,
  subscriptionStatusUpdate,
} = require("../services/subscription.service");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const ApiError = require("../utils/ApiError");

//Create subscription
const CreateSubscription = catchAsync(async (req, res) => {
  const { id } = req.user;
  const payload = { ...req.body, author: id };

  const result = await createSubscription(payload);
  res.status(httpStatus.CREATED).json(
    response({
      message: "subscription Created success ",
      status: "created",
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

//Find subscription
const AllSubscription = catchAsync(async (req, res) => {
  const { packageType, status } = req.query;
  const { role } = req.user;
  const result = await allSubscription(role, packageType, status);
  res.status(httpStatus.OK).json(
    response({
      message: "subscriptions retrieved success ",
      status: "retrieved",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

//Find subscription
const SingleSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  const result = await singleSubscription(id, role);
  res.status(httpStatus.OK).json(
    response({
      message: "subscription retrieved success ",
      status: "retrieved",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});
//
//update subscription
const UpdateSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;
if (!req.body.packageDuration && !req.body.packagePrice) {
    throw new ApiError(httpStatus.BAD_REQUEST, "provide subscription packageType or packagePrice")
}
  const result = await updateSubscription(id,req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "subscription update success ",
      status: "update",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});
//update subscription
const SubscriptionStatusUpdate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await subscriptionStatusUpdate(id,req.body.status);
  res.status(httpStatus.OK).json(
    response({
      message: "subscription status update success ",
      status: "update",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});
//update subscription
const DeleteSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await deleteSubscription(id);
  res.status(httpStatus.OK).json(
    response({
      message: "subscription delete success ",
      status: "delete",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});
//update subscription
const RestoreSubscription = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await restoreSubscription(id);
  res.status(httpStatus.OK).json(
    response({
      message: "subscription restore success ",
      status: "restore",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  CreateSubscription,
  AllSubscription,
  SingleSubscription,
  UpdateSubscription,
  DeleteSubscription,
  RestoreSubscription,
  SubscriptionStatusUpdate
};



