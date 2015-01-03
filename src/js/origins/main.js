/* global define */

define([
    'underscore',
    'jquery',
    './app',
    './init',
    './router'
], function(_, $, app, init, router) {

    return function(options) {
        options = _.clone(options);

        // An endpoint is required
        if (!options.endpoint) {
            throw new Error('Origins endpoint required');
        }

        // Initialize the application which involves adding
        // binding event handlers to the document and window
        // and setting up logging.
        init(options);

        // Initialize a router for the application. This done here rather than
        // in the app module to a circular dependency with the sub-routers.
        app.router = new router.AppRouter({
            app: app
        });

        // Start the application
        app.start(options);
    };

});
