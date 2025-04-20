const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createEvent = {
    body: Joi.object().keys({
        author: Joi.string().custom(objectId),
        title: Joi.string().required()
        }),
  };
const updateEvent = {
    body: Joi.object().keys({
        title: Joi.string().optional()
        }),
  };

  module.exports = {
    createEvent,
    updateEvent
  }
  