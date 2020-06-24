const userCtrl = require('./user-routes');
const placeCtrl = require('./place-routes');

module.exports = [].concat(userCtrl, placeCtrl);