'use strict';

const Joi = require('joi');

const authenticateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required()
});

module.exports = authenticateUserSchema;