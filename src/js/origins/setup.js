/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    'jquery',
    'loglevel',
    './notify',
    './core',
    'bootstrap'
], function(_, Backbone, Marionette, $, loglevel, notify, origins) {

    // Extend Marionette template loader facilities to use Origins template API
    var defaultLoadTemplate = Marionette.TemplateCache.prototype.loadTemplate,
        defaultCompileTemplate = Marionette.TemplateCache.prototype.compileTemplate;

    // Override to get in the template cache
    Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
        var func = origins.templates.get(templateId);
        if (!func) func = defaultLoadTemplate.call(this, templateId);
        return func;
    };

    // Prevent re-compiling already compiled templates
    Marionette.TemplateCache.prototype.compileTemplate = function(template) {
        if (typeof template !== 'function') {
            template = defaultCompileTemplate(template);
        }
        return template;
    };

    // Initialize notification stream and append it to the body
    var stream = new notify.Notifications({
        id: 'origins-notifications'
    });

    $('body').append(stream.render().el);

    // Add public method
    origins.notify = stream.notify;

    // Support cross origin requests with credentials (i.e. cookies)
    // See http://www.html5rocks.com/en/tutorials/cors/

    $.ajaxPrefilter(function(xhr, settings) {
        settings.xhrFields = {
            withCredentials: true
        };
    });

    // Setup debugging facilities
    if (origins.config.get('debug')) {
        loglevel.setLevel('debug');

        origins.on('all', function() {
            loglevel.info.apply(loglevel.info, [].slice.call(arguments, 0));
        });
    }

    window.onerror = function(message, file, line, column, error) {
        if (origins.config.get('debug') && error !== undefined) {
            origins.notify({
                header: 'Error',
                level: 'danger',
                message: error.stack,
                timeout: 0
            });
        }
    };

    // Relies on the jquery-ajax-queue plugin to supply this method.
    // This ensures data is not silently lost
    $(window).on('beforeunload', function() {
        if (origins.config.get('debug')) {
            // Turn off ajax error handling to prevent unwanted notifications displaying
            $(document).off('ajaxError');
            return;
        }

        /* Add conditional if there are pending requests
         *
        return "Wow, you're quick! Your data is being saved. " +
               "It will only take a moment.";
         */
    });

    $(document).ajaxError(function(event, xhr, settings, exception) {
        // A statusText value of 'abort' is an aborted request which is
        // usually intentional by the app or from a page reload.
        if (xhr.statusText === 'abort' || (xhr.status >= 300 && xhr.status < 500)) return;

        var message = '';

        if (xhr.status === 0 && exception === '') {
            // An empty exception value is an unknown error which usually
            // means the server is unavailable.
            message = 'The application is no longer responding.';
        }
        else {
            // General purpose error message
            message = 'There is a communication problem with the server. ' +
                '<a href="#" onclick="location.reload()">Refreshing</a> ' +
                'the page may help.';
        }

        origins.notify({
            timeout: null,
            dismissable: true,
            level: 'danger',
            header: 'Uh oh.',
            message: message
        });
    });

});
