/* global define */

define([
    'underscore'
], function(_) {

    // Merges a slice of objects from an array into the target.
    // This is used for collecting modules under a namespace.
    var exports = function(mods, offset) {
        offset = offset || 0;

        // Negative offset
        if (offset < 0) {
            offset = mods.length + offset;
        }

        // Make a copy
        mods = [].slice.call(mods, offset);

        // Prepend the target
        mods.unshift({});

        // Creates the output module
        var module = _.extend.apply(null, mods);

        // Enable adding additional modules
        module.add = function(mod) {
            _.extend(this, mod);
        };

        return module;
    };

    var templates = function(names, tpls, offset) {
        offset = offset || 0;

        // Negative offset
        if (offset < 0) {
            offset = tpls.length + offset;
        }

        // Make a copy
        tpls = [].slice.call(tpls, offset);

        return _.object(names, tpls);
    };

    var setDocumentTitle = function(title) {
        if (!title) {
            title = 'Origins';
        }
        else {
            title = 'Origins | ' + title;
        }

        document.title = title;
    };

    var documentPath = function() {
        // Path of the target link
        var path = document.location.pathname;

        // Handle IE quirk
        if (path.charAt(0) !== '/') path = '/' + path;

        return path;
    };

    return {
        exports: exports,
        templates: templates,
        documentPath: documentPath,
        setDocumentTitle: setDocumentTitle
    };

});
