const fs = require('fs');
const Boom = require('@hapi/boom');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const createToken = require('../util/token');


const getUsers = async (req, handler) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (error) {
        throw Boom.badImplementation('Fetching users failed, please try again later');
    }

    return {
        users: users.map(user => user.toObject({ getters: true }))
    };
}

const signup = async (req, res) => {
    const { name, email, password, file } = req.payload;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        throw Boom.badImplementation('Could not create user, please try again later');
    }

    if (existingUser) {
        throw Boom.forbidden('User already exists. Please log in');
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        throw Boom.badImplementation('Could not create user, please try again later');
    }

    const createdUser = new User({
        name,
        email,
        image: 'sample url',
        password: hashedPassword,
        places: []
    });


    try {
        await createdUser.save();
    } catch (error) {
        Boom.badImplementation('Something went wrong, please try again');
    }

    let token;
    try {
        token = createToken(createdUser);
    } catch (err) {
       Boom.badImplementation('Something went wrong, please try again');
    }

    return { userId: createdUser.id, email: createdUser.email, token: token };
}

const login = async (req, handler) => {

    const { email, password } = req.payload;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        throw Boom.badImplementation('Logging in failed, Please try again later');
    }

    if (!existingUser) {
        throw Boom.forbidden('Invalid credentials, could not log you in');
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        throw Boom.badImplementation('Could not log you in. Please try again later');
    }

    if (!isValidPassword) {
        throw Boom.forbidden('Invalid credentials, could not log you in');
    }

    let token;
    try {
        token = createToken(existingUser);
    } catch (err) {
        throw Boom.badImplementation('Could not log you in. Please try again later');
    }
    return {
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    };
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;