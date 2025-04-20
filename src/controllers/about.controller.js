const httpStatus = require("http-status");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const {
  createAbout,
  allAbout,
  updateAbout,
  deleteAbout,
} = require("../services/about.service");

// Create About Us Entry
const CreateAbout = catchAsync(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(httpStatus.BAD_REQUEST, "provide about 'content'");
  }
  const data = await createAbout({ content });
  res.status(httpStatus.CREATED).json(
    response({
      message: "About Us entry created successfully",
      status: "created",
      statusCode: httpStatus.CREATED,
      data,
    })
  );
});

// Get All About Us Entries or a Specific One
const GetAllAbout = catchAsync(async (req, res) => {
  const { role } = req.user;
  const { aboutId, isDeleted, page, limit } = req.query;
  const data = await allAbout(aboutId, isDeleted, role, page, limit);
  res.status(httpStatus.OK).json(
    response({
      message: "About Us entries retrieved successfully",
      status: "ok",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

// Update About Us Entry
const UpdateAbout = catchAsync(async (req, res) => {
  const { content } = req.body;
  console.log(content);
  const { about_id } = req.params;
  if (!content) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Provide data to update!");
  }
  const data = await updateAbout(about_id, content);
  res.status(httpStatus.OK).json(
    response({
      message: "About Us entry updated successfully",
      status: "updated",
      statusCode: httpStatus.OK,
      data,
    })
  );
});

// Delete About Us Entry
const DeleteAbout = catchAsync(async (req, res) => {
  const { about_id } = req.params;
  await deleteAbout(about_id);
  res.status(httpStatus.OK).json(
    response({
      message: "About Us entry deleted successfully",
      status: "deleted",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

module.exports = {
  CreateAbout,
  GetAllAbout,
  UpdateAbout,
  DeleteAbout,
};
