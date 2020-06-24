
'use strict';

const Joi = require('@hapi/joi');

const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(6).required()
});

module.exports = createUserSchema;