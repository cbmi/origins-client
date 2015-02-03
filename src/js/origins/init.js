/* global define */

define([
    'jquery',
    'backbone',
    'loglevel',

    // Import to register behaviors
    './views/behaviors',

    // Exports
    'bootstrap',
    'bootstrap3-typeahead'
], function($, Backbone, loglevel) {

    // Takes a click event and attempts to navigate to it in the app.
    // If it is not a valid route, process the link normally.
    var handleRoute = function(event) {
        // Skip hijacking modified clicks since it may be to open a new
        // tab for instance.
        if (event.metaKey) return;

        var path = this.pathname;

        // Handle IE quirk
        if (path.charAt(0) !== '/') path = '/' + path;

        // Trim off the root on the path if present
        var root = Backbone.history.root || '/';

        if (path.slice(0, root.length) === root) {
            path = path.slice(root.length);
        }

        // Cancel
        var cancel = Backbone.history.navigate(path, {
            trigger: true
        });

        // Navigate will return false if the path does not match a route,
        // true if it does and undefined if the path is the current page.
        // Ensure the hash is not different so jumping to anchors are not broken.
        if (cancel === true || (cancel === undefined && location.hash === this.hash)) {
            event.preventDefault();
        }
    };

    // Return the init function directly to be called in main
    return function(options) {
        // Enable debug messages
        if (options.debug) {
            loglevel.setLevel('debug');
        }

        // Hijack anchor click events to attempt to trigger a route
        $(document).on('click', 'a', handleRoute);

        // Support cross origin requests with credentials (i.e. cookies)
        // See http://www.html5rocks.com/en/tutorials/cors/
        $.ajaxPrefilter(function(xhr, settings) {
            settings.xhrFields = {
                withCredentials: true
            };
        });

        $(document).ajaxError(function(event, xhr, settings, exception) {
            // A statusText value of 'abort' is an aborted request which is
            // usually intentional by the app or from a page reload.
            if (xhr.statusText === 'abort' ||
                (xhr.status >= 300 && xhr.status < 500)) return;

            var message = '';

            if (xhr.status === 0 && exception === '') {
                // An empty exception value is an unknown error which usually
                // means the server is unavailable.
                message = 'The app is no longer responding.';
            }
            else {
                // General purpose error message
                message = 'There is a communication problem with the server. ' +
                    '<a href="#" onclick="location.reload()">Refreshing</a> ' +
                    'the page may help.';
            }

            loglevel.error(message);
        });


        $(window).on('beforeunload', function() {
            // Turn off ajax error handling during development
            if (options.debug) {
                $(document).off('ajaxError');
            }
        });


    };

});
