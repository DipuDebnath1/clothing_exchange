const Joi = require("joi");

const createProduct = {
  body: Joi.object().keys({
    author: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    age: Joi.string()
      .valid("0-1", "1-3", "4-9", "10-15", "16-21")
      .required(),
    gender: Joi.string().valid("male", "female", "custom").required(),
    location: Joi.string().required(),
    color: Joi.string().required(),
    status: Joi.string().valid("available", "unavailable").required(),
    isDeleted: Joi.boolean().default(false).optional(),
    changedBy: Joi.string().required(),
  }),
};

const Joi = require("joi");

const updateProduct = {
  body: Joi.object().keys({
    author: Joi.string().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    age: Joi.string()
      .valid("0-1", "1-3", "4-9", "10-15", "16-21")
      .optional(),
    gender: Joi.string().valid("male", "female", "custom").optional(),
    location: Joi.string().optional(),
    color: Joi.string().optional(),
    status: Joi.string().valid("available", "unavailable").optional(),
    isDeleted: Joi.boolean().optional(),
    changedBy: Joi.string().optional(),
  }),
};


module.exports = {
  createProduct,  
  updateProduct,

};
