/* global define */

define([
    'underscore'
], function(_) {

    // Replace underscore to camel-case
    var utoc = function(s) {
        return s.replace(/_([a-z])/g, function (m) {
            return m[1].toUpperCase();
        });
    };

    // Replace all camel-case to underscore
    var ctou = function(s) {
        return s.replace(/[a-z]([A-Z])/g, function (m) {
            return '_' + m[1].toLowerCase();
        });
    };

    // Recursively converts all keys in an object from underscore to
    // camel-case. This is can be applied to the Model.parse method to
    // convert server-side data into a more common format. `method` is
    // either utoc or ctou.
    var convert = function (attrs, method) {
        var nkey, _attrs = {};

        _.each(attrs, function(value, key) {
            // Apply function
            nkey = method(key);

            // Recurse on object values
            if (_.isObject(value) && !_.isArray(value)) {
                value = convert(value, method);
            }

            _attrs[nkey] = value;
        });

        return _attrs;
    };

    return {
        utoc: utoc,
        ctou: ctou,
        convert: convert
    };
});
