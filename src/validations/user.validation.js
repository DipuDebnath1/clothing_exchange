const Joi = require("joi");
const { password, objectId } = require("./custom.validation");
const { roles } = require("../config/roles");

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
    password: Joi.string().required().min(8)
  }),
};


const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    email: Joi.string().optional().email(),
    phone: Joi.string().optional(),
    password: Joi.string().optional().min(8),
    role: Joi.string()
      .valid(...roles)
      .optional(),
  }),
};


const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};


module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
