const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  createFAQ,
  allFAQs,
  updateFAQ,
  deleteFAQ,
} = require("../services/faq.service");
const ApiError = require("../utils/ApiError");

const CreateFAQ = catchAsync(async (req, res) => {
  console.log(req.body);
  if (!req.body.question || !req.body.answer) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "faq question or answer missing"
    );
  }
  const faq = await createFAQ(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: "FAQ created successfully",
    data: faq,
  });
});

const GetFAQs = catchAsync(async (req, res) => {
  const { faqId, isDeleted, role, page, limit } = req.query;
  const faqs = await allFAQs(faqId, isDeleted, role, page, limit);
  res.status(httpStatus.OK).json({
    success: true,
    message: "FAQs fetched successfully",
    data: faqs,
  });
});

const UpdateFAQ = catchAsync(async (req, res) => {
  const { faqId } = req.params;
  const updatedFAQ = await updateFAQ(faqId, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: "FAQ updated successfully",
    data: updatedFAQ,
  });
});

const DeleteFAQ = catchAsync(async (req, res) => {
  const { faq_id } = req.params;
  await deleteFAQ(faq_id);
  res.status(httpStatus.OK).json({
    success: true,
    message: "FAQ deleted successfully",
  });
});

module.exports = {
  CreateFAQ,
  GetFAQs,
  UpdateFAQ,
  DeleteFAQ,
};
