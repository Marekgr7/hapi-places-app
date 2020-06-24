
const userCtrl = require('../../controllers/user-controller');

module.exports = [
    { method: 'GET', path: '/users', handler: (req, handler) => {return 'hi';} },
    { method: 'GET', path: '/', handler: (req, handler) => {return 'hi';} }
];

