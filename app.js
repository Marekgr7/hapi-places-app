'use strict';

const fs = require('fs');
const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const Boom = require('@hapi/boom');

const userInfo = require('./personal-info/user-info');


const validate = async (decoded, request) => {

    if(request.method === 'OPTION') {
        return { isValid: true };
    }

    return { isValid: true };
};


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

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

    await server.route(
        {
            method: 'POST',
            path: '/upload',
            options: {
                payload: {
                    output: 'stream',
                    parse: true,
                    multipart: true
                },
                handler: async (req, handler) => {
                    const data = req.payload;
                    const file = data.file;
                    console.log(data);
                    console.log('file was accepted');

                    let fileName;


                    try {
                            fileName = 'sample name';

                            const out = fs.createWriteStream(`./uploads/images/${fileName}`);
                            await file.pipe(out);

                    } catch (error) {
                        console.log(error);
                        console.log('picture upload failed');
                        throw Boom.badImplementation('something went wrong, please try once again');
                    }

                    return 'file was uploaded';
                }
            }
        }
    );

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
