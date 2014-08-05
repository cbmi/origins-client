/* global define */

define([
    'underscore',
    './origins/core',
    './origins/models',
    './origins/views',
    './origins/templates',
    './origins/setup'
], function(_, origins, models, views, templates) {

    // Attach containers of models and ui (views) components
    origins.models = models;
    origins.store = models.store;
    origins.views = views;
    origins.templates = templates;

    // Update to additional asynchronous checks
    var checkReady = function() {
        return templates.ready();
    };

    // Initial check
    var ready = checkReady();

    // Takes a handler to call once Origins has declared itself "ready".
    // Once origins is ready, subsequent handlers will be executed
    // immediately.
    origins.ready = function(handler) {
        if (ready) {
            if (handler) handler();
            return;
        }

        // Re-evalute ready status every 15 ms
        var intervalId = setInterval(function() {
            ready = checkReady();

            if (ready) {
                clearTimeout(timeoutId);
                clearTimeout(intervalId);
                origins.trigger('ready', origins);

                if (handler) handler();
            }
        }, 15);

        // Add a timeout in case there is a bug or something cause the components
        // never to be ready.
        var timeoutId = setTimeout(function() {
            clearTimeout(intervalId);

            origins.notify({
                timeout: null,
                dismissable: false,
                level: 'error',
                header: 'Too long getting ready.',
                message: 'Sorry about that, a few of the components needed ' +
                         'to display the page took too longer to load. A ' +
                         '<a href="#" onclick="location.reload()">refresh</a> ' +
                         'sometimes resolves the issue.'
            });
        }, 500);
    };

    this.origins = origins;

    origins.trigger('init', origins);

    return origins;

});
