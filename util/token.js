'use strict';

const jwt = require('jsonwebtoken');
const userInfo = require('../personal-info/user-info');

const createToken = (user) => {
    return jwt.sign({ id: user._id, name: user.name} , userInfo.secretJwt, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
};

module.exports = createToken;