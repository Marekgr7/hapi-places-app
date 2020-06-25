
exports.plugin = {
    async register(server) {
        await server.register(require('@hapi/inert'));

        server.route({
            method: 'GET',
            path: '/{pictureId}',
            handler: (req, h) => {
                return h.file(`./uploads/images/${req.params.pictureId}`);
            }
        });
    },
    version: require('../package.json').version,
    name: 'route-static'
};