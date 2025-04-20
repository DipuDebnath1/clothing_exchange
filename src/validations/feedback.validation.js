const Joi = require("joi");

const createFeedbackValidation = {
  body: Joi.object().keys({
    mainActivity: Joi.number().integer().min(1).max(5).required(),
    food: Joi.number().integer().min(1).max(5).required(),
    service: Joi.number().integer().min(1).max(5).required(),
    vibaAtmosphere: Joi.number().integer().min(1).max(5).required(),
    overallRating: Joi.number().integer().min(1).max(5).required(),
  }),
};

module.exports = createFeedbackValidation;
