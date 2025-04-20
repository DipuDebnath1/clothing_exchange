const response = require("../config/response");
const { allTerms, updateTerm } = require("../services/tarmsConditions.service");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
//UpdateTerms
const UpdateTerms = catchAsync(async (req, res) => {

  const {id} = req.params
  const {content} = req.body
  if (!content) {
    throw new ApiError(httpStatus.BAD_REQUEST, "provide update content !")
  }

    const data = await updateTerm(id, content);
    res.status(httpStatus.OK).json(
      response({
        message: "allTerms entries retrieved successfully",
        status: "ok",
        statusCode: httpStatus.OK,
        data,
      })
    );
  });
  //GetAllTerms
const GetAllTerms = catchAsync(async (req, res) => {
    const data = await allTerms();
    res.status(httpStatus.OK).json(
      response({
        message: "allTerms entries retrieved successfully",
        status: "ok",
        statusCode: httpStatus.OK,
        data,
      })
    );
  });


  module.exports = {
    UpdateTerms,
    GetAllTerms
  }