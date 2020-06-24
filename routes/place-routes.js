const placeCtrl = require('../controllers/place-controller');

exports.plugin = {
    async register(server, options) {
        server.route([
            {
                method: 'GET',
                path: '/places/{placeId}',
                options: {
                    description: 'get place by id',
                    handler: placeCtrl.getPlaceById
                }
            },
            {
                method: 'GET',
                path: '/places/user/{userId}',
                options: {
                    description: 'get places by user id',
                    handler: placeCtrl.getPlacesByUserId
                }
            },
            {
                method: 'POST',
                path: '/places',
                options: {
                    description: 'create new place',
                    handler: placeCtrl.createPlace,
                    auth: {
                        strategy: 'jwt'
                    }
                }
            },
            {
                method: 'PATCH',
                path: '/places/{placeId}',
                options: {
                    description: 'update a place by id',
                    handler: placeCtrl.updatePlace,
                    auth: {
                        strategy: 'jwt'
                    }
                }
            },
            {
                method: 'DELETE',
                path: '/places/{placeId}',
                options: {
                    description: 'delete place by id',
                    handler: placeCtrl.deletePlace,
                    auth: {
                        strategy: 'jwt'
                    }
                }
            }
        ]);
    },
    version: require('../package.json').version,
    name: 'route-places'
};