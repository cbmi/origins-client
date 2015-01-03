/* global define */

define([
    './routes/core',
    './routes/base',
    './routes/resource',
    './routes/entity',
    './routes/topology',
    './routes/link'
], function(core, base, resource, entity, topology, link) {

    // The ApprRouter contains all the routing for the application
    // including sub-routes.
    var AppRouter = core.Router.extend({
        routes: {
            '': {
                router: base.Router
            },

            'resources/': {
                name: 'resource',
                router: resource.Router
            },

            'entities/': {
                name: 'entity',
                router: entity.Router
            },

            'topologies/': {
                name: 'topology',
                router: topology.Router
            },

            'links/': {
                name: 'link',
                router: link.Router
            }
        }
    });


    return {
        AppRouter: AppRouter
    };

});
