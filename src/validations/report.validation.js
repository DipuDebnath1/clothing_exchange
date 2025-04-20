const Joi = require("joi");

const createReport = {
  body: Joi.object().keys({
    author: Joi.string().required().messages({
      "any.required": "author is required",
    }),
    reportBy: Joi.string().required().messages({
      "any.required": "reportBy is required",
    }),
    product: Joi.string().required().messages({
      "any.required": "product is required",
    }),
    title: Joi.string().required().messages({
      "any.required": "title is required",
    }),
    description: Joi.string().required().messages({
      "any.required": "description is required",
    }),
    isDeleted: Joi.boolean().optional().default(false),
  }),
};

module.exports = {
  createReport,
};
