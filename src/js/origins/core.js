/* global define */

define([
    'underscore',
    'backbone',
    './config',
    './utils',
], function(_, Backbone, config, utils) {

    var origins = {
        // Version of origins
        version: '0.1.0-beta',

        // Initialize the session manager and default configuration
        config: new config.Config(this.origins),

        // Attach commonly used utilities
        utils: utils,

        urls: {}
    };

    // Give the origins events
    _.extend(origins, Backbone.Events);

    return origins;
});
