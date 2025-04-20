const Joi = require("joi");

const createSubscriptionValidation = {
  body: Joi.object().keys({
    packageDurationType: Joi.string().valid("day", "month").required(),
    packageDuration: Joi.when("packageDurationType", {
      is: "day",
      then: Joi.number().integer().min(1).max(31).required(),
      otherwise: Joi.number().integer().min(1).required(), // For months, min 1
    }),
    packageFacility: Joi.array().items(Joi.string()).optional(),
    packagePrice: Joi.number().required(),
    status: Joi.string()
      .valid("upcoming", "active", "close", "completed")
      .default("active"),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  }),
};

const updateSubscriptionValidation = {
  body: Joi.object().keys({
    packageDurationType: Joi.string().valid("day", "month").optional(),
    packageDuration: Joi.when("packageDurationType", {
      is: "day",
      then: Joi.number().integer().min(1).max(31).optional(),
      otherwise: Joi.number().integer().min(1).optional(), // For months, min 1
    }),
    packageFacility: Joi.array().items(Joi.string()).optional(),
    packagePrice: Joi.number().optional(),
    status: Joi.string()
      .valid("upcoming", "active", "close")
      .default("active"),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
  }),
};
//
module.exports = { createSubscriptionValidation, updateSubscriptionValidation };

