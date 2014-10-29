/* global define */

define([
    'jquery',
    'backbone',
    'loglevel'
], function($, Backbone, loglevel) {

    if (!String.prototype.toTitleCase) {
        String.prototype.toTitleCase = function() {
            // Do not title case strings that aren't completely lowercase
            if (this.toLowerCase() !== this) return this;

            return this.replace(/\w\S*/g, function(text) {
                return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
            });
        };
    }

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

        // Trim off the root on the path if present
        var root = Backbone.history.root || '/';

        if (path.slice(0, root.length) === root) {
            path = path.slice(root.length);
        }

        return path;
    };

    // Convenience method for getting a value using the dot-notion for
    // accessing nested structures.
    var getDotProp = function(obj, key, def) {
        var toks = key.split('.');

        for (var i = 0; i < toks.length; i++) {
            obj = obj[toks[i]];

            if (obj === undefined) {
                return def;
            }
        }
        // Final value of obj is returned
        if (typeof obj === 'function') {
            return obj.apply();
        }
        else {
            return obj;
        }
    };

    // Convenience method for setting a value using the dot-notion for
    // accessing nested structures.
    var setDotProp = function(obj, key, value) {
        if (typeof key === 'object') {
            // Second argument is a boolean to whether or not to replace
            // the options
            if (value === true) {
                return $.extend(true, {}, key);
            }
            return $.extend(true, obj, key);
        }

        var toks = key.split('.'),
            last = toks.pop();

        for (var t, i = 0; i < toks.length; i++) {
            t = toks[i];

            if (obj[t] === undefined) {
                obj[t] = {};
            }
            obj = obj[t];
        }
        obj[last] = value;
    };

    var pprint = function(obj) {
        loglevel.debug(JSON.stringify(obj, null, 4));
    };

    // jQuery Deparam - v0.1.0 - 6/14/2011
    // http://benalman.com/
    // Copyright (c) 2011 Ben Alman; Licensed MIT, GPL

    // A handy reference.
    var decode = decodeURIComponent;

    // Document $.deparam.
    var deparam = function(text, reviver) {
        // The object to be returned.
        var result = {};

        // Iterate over all key=value pairs.
        $.each(text.replace(/\+/g, ' ').split('&'), function(index, pair) {
            // The key=value pair.
            var kv = pair.split('=');
            // The key, URI-decoded.
            var key = decode(kv[0]);
            // Abort if there's no key.
            if ( !key ) { return; }
            // The value, URI-decoded. If value is missing, use empty string.
            var value = decode(kv[1] || '');
            // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
            // into its component parts.
            var keys = key.split('][');
            var last = keys.length - 1;
            // Used when key is complex.
            var i = 0;
            var current = result;

            // If the first keys part contains [ and the last ends with ], then []
            // are correctly balanced.
            if ( keys[0].indexOf('[') >= 0 && /\]$/.test(keys[last]) ) {
                // Remove the trailing ] from the last keys part.
                keys[last] = keys[last].replace(/\]$/, '');
                // Split first keys part into two parts on the [ and add them back onto
                // the beginning of the keys array.
                keys = keys.shift().split('[').concat(keys);
                // Since a key part was added, increment last.
                last++;
            } else {
                // Basic 'foo' style key.
                last = 0;
            }

            if ( $.isFunction(reviver) ) {
                // If a reviver function was passed, use that function.
                value = reviver(key, value);
            } else if ( reviver ) {
                // If true was passed, use the built-in $.deparam.reviver function.
                value = deparam.reviver(key, value);
            }

            if ( last ) {
                // Complex key, like 'a[]' or 'a[b][c]'. At this point, the keys array
                // might look like ['a', ''] (array) or ['a', 'b', 'c'] (object).
                for ( ; i <= last; i++ ) {
                    // If the current key part was specified, use that value as the array
                    // index or object key. If omitted, assume an array and use the
                    // array's length (effectively an array push).
                    key = keys[i] !== '' ? keys[i] : current.length;
                    if ( i < last ) {
                        // If not the last key part, update the reference to the current
                        // object/array, creating it if it doesn't already exist AND
                        // there's a next key. If the next key is non-numeric and not
                        // empty string, create an object, otherwise create an array.
                        current = current[key] = current[key] ||
                                  (isNaN(keys[i + 1]) ? {} : []);
                    } else {
                        // If the last key part, set the value.
                        current[key] = value;
                    }
                }
            } else {
                // Simple key.
                if ( $.isArray(result[key]) ) {
                    // If the key already exists, and is an array, push the new value onto
                    // the array.
                    result[key].push(value);
                } else if ( key in result ) {
                    // If the key already exists, and is NOT an array, turn it into an
                    // array, pushing the new value onto it.
                    result[key] = [result[key], value];
                } else {
                    // Otherwise, just set the value.
                    result[key] = value;
                }
            }
        });

        return result;
    };

    // Default reviver function, used when true is passed as the second argument
    // to $.deparam. Don't like it? Pass your own!
    deparam.reviver = function(key, value) {
        var specials = {
            'true': true,
            'false': false,
            'null': null,
            'undefined': undefined
        };

        return (+value + '') === value ? +value // Number
            : value in specials ? specials[value] // true, false, null, undefined
            : value; // String
    };

    return {
        documentPath: documentPath,
        setDocumentTitle: setDocumentTitle,
        deparam: deparam,
        pprint: pprint,
        getDotProp: getDotProp,
        setDotProp: setDotProp
    };
});
