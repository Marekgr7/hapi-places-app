const Joi = require('@hapi/joi');

const userCtrl = require('../controllers/user-controller');
const createUserSchema = require('../schemas/createUser');

exports.plugin = {
    async register(server, options) {
        server.route([
            {
                method: 'GET',
                path: '/users',
                options: {
                    description: 'get all users',
                    handler: userCtrl.getUsers
                }
            },
            {
                method: 'POST',
                path: '/users/signup',
                options: {
                    description: 'Sign up an user',
                    handler: userCtrl.signup,
                    validate: {
                        payload: createUserSchema
                    }
                }
            },
            {
                method: 'POST',
                path: '/users/login',
                options: {
                    description: 'Login an user',
                    handler: userCtrl.login
                }
            }
        ]);
    },
    version: require('../package.json').version,
    name: 'route-users'
};