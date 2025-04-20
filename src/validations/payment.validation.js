const Joi = require("joi");

const { default: mongoose } = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};
const BookSubEventPaymentValidation = {
  body: Joi.object().keys({
    subEvent: Joi.string().custom(objectId).required(),
    amount: Joi.number().required(),
    transactionId: Joi.string().required(),
    status: Joi.string().required().valid("success", "failed", "cancelled"),
  }),
};
const SubscriptionParchesPaymentValidation = {
  body: Joi.object().keys({
    subscription_id: Joi.string().custom(objectId).required(),
    amount: Joi.number().required(),
    transaction_id: Joi.string().required(),
    status: Joi.string().required().valid("success", "failed", "cancelled"),
  }),
};
//
module.exports = {
  BookSubEventPaymentValidation,
  SubscriptionParchesPaymentValidation,
};
