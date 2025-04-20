const httpStatus = require("http-status");
const { FAQ } = require("../models");
const ApiError = require("../utils/ApiError");

const createFAQ = async (payload) => {
  return await FAQ.create(payload);
};

const allFAQs = async (faqId, isDeleted, role, page = 1, limit = 10) => {
  // Ensure page and limit are valid numbers
  page = Math.max(1, Number(page));
  limit = Math.max(1, Number(limit));
  const skip = (page - 1) * limit;

  const filter = {};

  if (faqId) {
    const res = await FAQ.findById(faqId);
    if (!res) {
      throw new ApiError(httpStatus.NOT_FOUND, "This FAQ not found.");
    }
    return res;
  }

  // Set `isDeleted` filter based on role
  if (role === "admin" && isDeleted === "false") {
    filter.isDeleted = false;
  } else if (role === "admin" && isDeleted === "true") {
    filter.isDeleted = true;
  } else if (role !== "admin") {
    filter.isDeleted = false;
  } 

  // Fetch total count and paginated results in parallel
  const [totalFAQs, faqList] = await Promise.all([
    FAQ.countDocuments(filter),
    FAQ.find(filter).skip(skip).limit(limit),
  ]);

  return {
    result: faqList,
    page,
    resultPerPage: limit,
    totalResult: totalFAQs,
    totalPage: Math.ceil(totalFAQs / limit),
  };
};

const updateFAQ = async (faqId, content) => {
  const res = await FAQ.findById(faqId);
  if (!res) {
    throw new ApiError(httpStatus.BAD_REQUEST, "faq not found!");
  }
  if (content.question) res.question = content.question;
  if (content.answer) res.answer = content.answer;
  await res.save();
  return res;
};

const deleteFAQ = async (id) => {
  const faq = await FAQ.findById(id);
  if (!faq) {
    throw new ApiError(httpStatus.NOT_FOUND, "faq not found");
  }
  faq.isDeleted = true;
  await faq.save();
  return faq;
};

module.exports = {
  createFAQ,
  allFAQs,
  updateFAQ,
  deleteFAQ,
};
