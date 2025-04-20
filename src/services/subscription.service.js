const httpStatus = require("http-status");
const { Subscription } = require("../models");
const ApiError = require("../utils/ApiError");

const createSubscription = async (payload) => {
  return await Subscription.create(payload);
};

const allSubscription = async (role, packageType, status) => {
  const filter = {};

  if (role !== "admin") {
    filter.isDeleted = false;
  }
  if (packageType) {
    filter.packageType = packageType;
  }
  if (status) {
    filter.status = status;
  }
  return await Subscription.find(filter);
};

const singleSubscription = async (id, role) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "subscription  not found !");
  }
  if (subscription.isDeleted && role !== "admin") {
    throw new ApiError(httpStatus.BAD_REQUEST, "subscription  is deleted !");
  }
  return subscription;
};

const updateSubscription = async (id, payload) => {
  const { packageDuration, packagePrice, packageFacility } = payload;
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "subscription  not found !");
  }
  if (subscription.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, "subscription  is already deleted !");
  }
//   packageDuration
  if (packageDuration) {
    subscription.packageDuration = packageDuration;
  }
//   packagePrice
  if (packagePrice) {
    subscription.packagePrice = packagePrice;
  }
  if (packageFacility) {
    subscription.packageFacility = packageFacility;
  }
//   subscription save 
  await subscription.save();
  return subscription;
};
const subscriptionStatusUpdate = async (id, status) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "subscription  not found !");
  }
  if (subscription.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, "subscription  is already deleted !");
  }
//   packageDuration
    subscription.status = status;
  

//   subscription save 
  await subscription.save();
  return subscription;
};

const deleteSubscription = async (id) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "subscription  not found !");
  }
  if (subscription.isDeleted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "subscription  is already deleted !"
    );
  }

  subscription.isDeleted = true;
  await subscription.save();
  return subscription;
};

const restoreSubscription = async (id) => {
  const subscription = await Subscription.findById(id);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, "subscription  not found !");
  }
  subscription.isDeleted = false;
  await subscription.save();
  return subscription;
};

module.exports = {
  createSubscription,
  allSubscription,
  singleSubscription,
  updateSubscription,
  deleteSubscription,
  restoreSubscription,
  subscriptionStatusUpdate
};
