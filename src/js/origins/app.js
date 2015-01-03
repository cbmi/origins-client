/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    './links'
], function(_, Backbone, Marionette, links) {

    var App = Marionette.Application.extend({
        version: '0.1.0-beta',

        regions: {
            main: '#main'
        },

        start: function(options) {
            // Request the service root to get back the set of links available
            // to the client.
            Backbone.$.get(options.endpoint).done(function(data, status, xhr) {

                // Augment application with links
                _.extend(this, links.parse(xhr));

                // Start the application which triggers the route.
                Marionette.Application.prototype.start.call(this, options);

            }.bind(this));
        },

        onStart: function() {
            // Start the Backbone history. If the current path does not match
            // redirect to the root.
            if (!Backbone.history.start({pushState: true})) {
                Backbone.history.navigate('/', {trigger: true});
            }
        }
    });

    // Initialize and return application as is so
    // other modules can reference it directly.
    return new App();

});
