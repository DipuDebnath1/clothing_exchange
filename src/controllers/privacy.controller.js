const response = require("../config/response");
const { allPrivacy, updatePrivacy } = require("../services/privacy.service");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");


//GetPrivacy
const UpdatePrivacy = catchAsync(async (req, res) => {
  const {id} = req.params
  const {content} = req.body
  if (!content) {
    throw new ApiError(httpStatus.BAD_REQUEST, "provide update content !")
  }
    const data = await updatePrivacy(id, content);
    res.status(httpStatus.OK).json(
      response({
        message: "privacy update successfully",
        status: "ok",
        statusCode: httpStatus.OK,
        data,
      })
    );
  });
//GetPrivacy
const GetPrivacy = catchAsync(async (req, res) => {
    const data = await allPrivacy();
    res.status(httpStatus.OK).json(
      response({
        message: "privacy entries retrieved successfully",
        status: "ok",
        statusCode: httpStatus.OK,
        data,
      })
    );
  });


  module.exports = {
    UpdatePrivacy,
    GetPrivacy
  }