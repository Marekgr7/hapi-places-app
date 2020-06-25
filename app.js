'use strict';

const fs = require('fs');
const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const Boom = require('@hapi/boom');
const Path = require('path');

const userInfo = require('./personal-info/user-info');


const validate = async (decoded, request) => {

    if(request.method === 'OPTION') {
        return { isValid: true };
    }

    return { isValid: true };
};


const init = async () => {

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: true
        }
    });

    await server.register({
        plugin: require('./plugins/logger')
    });


    await server.register({
        plugin: require('./routes/static-routes')
    })

    server.realm.modifiers.route.prefix = '/api';

    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: userInfo.secretJwt,
        validate,
        verifyOptions: { algorithms : [ 'HS256' ] }
    });

    await server.register({
        plugin: require('./routes/user-routes')
    });

    await server.register({
        plugin: require('./routes/place-routes')
    });


    await server.start();
    console.log('Server is running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


mongoose
    .connect(
        userInfo.mongoUrl
    )
    .then(() => {
        init();
    })
    .catch(err => {
        console.log(err);
    });
