const httpStatus = require("http-status");
const { AboutUs } = require("../models");
const ApiError = require("../utils/ApiError");


const allAbout = async (aboutId, isDeleted, role, page = 1, limit = 10) => {
  // Ensure page and limit are valid numbers
  page = Math.max(1, Number(page));
  limit = Math.max(1, Number(limit));
  const skip = (page - 1) * limit;

  const filter = {};
  if (aboutId) {
    const res = await AboutUs.findById(aboutId);
    if (!res) {
      throw new ApiError(httpStatus.NOT_FOUND, "This about not found.");
    }
    return res;
  }
  // Set `isDeleted` filter based on role
  if (role === "admin" && isDeleted === "false") {
    filter.isDeleted = false;
  }

  if (role === "admin" && isDeleted === "true") {
    filter.isDeleted = true;
  }

  if (role !== "admin") {
    filter.isDeleted = false;
  }

  console.log(filter);

  // Fetch total count and paginated results in parallel
  const [totalAbout, aboutList] = await Promise.all([
    AboutUs.countDocuments(filter),
    AboutUs.find(filter).skip(skip).limit(limit),
  ]);

  return {
    result: aboutList,
    page,
    resultPerPage: limit,
    totalResult: totalAbout,
    totalPage: Math.ceil(totalAbout / limit),
  };
};

const updateAbout = async (aboutId, content) => {
  return await AboutUs.findByIdAndUpdate(aboutId, {content:content});

};

const deleteAbout = async (id) => {
  return await AboutUs.findByIdAndUpdate(id, { isDeleted: true });
};

module.exports = {
  allAbout,
  updateAbout,
  deleteAbout,
};
