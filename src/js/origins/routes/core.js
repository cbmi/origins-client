/* global define */

define([
    'underscore',
    'backbone',
    '../utils'
], function(_, Backbone, utils) {

    var optionalParam = /\((.*?)\)/g,
        namedParam = /(\(\?)?:\w+/g,
        splatParam = /\*\w+/g,
        escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    var param = /:\w+/g;

    var Router = Backbone.Router.extend({
        options: {
            name: '',

            // Root to mount these routes at
            root: '',

            // Make the regular expression case insensitive.
            ignoreCase: true,

            // If the route has a trailing slash and this is true,
            // match on the route with the trailing slash omitted.
            appendSlash: true
        },

        // Convnience method to set the document title
        setTitle: function(title) {
            utils.setDocumentTitle(title);
        },

        constructor: function(options) {
            options = options || {};

            // Bind options for later use
            this.options = _.extend({}, this.options, options);

            // Bind app directly to router
            this.app = options.app;

            if (options.routes) this.routes = options.routes;

            // Array of subrouters
            this.subs = [];

            // Add route to replace all routes not ending in a slash to
            // their trailing slash form
            if (this.options.appendSlash) {
                this.route(/(.+[^\/]$)/, function(url) {
                    this.navigate(url + '/', {
                        trigger: true,
                        replace: true
                    });
                });
            }

            this._bindRoutes();

            this.initialize.call(this, options);
        },

        // Extend to allow for a missing trailing slash
        _routeToRegExp: function (route) {
            // Prepend root to route
            route = this.options.root + route;

            var routeRe = route.replace(escapeRegExp, '\\$&')
                               .replace(optionalParam, '(?:$1)?')
                               .replace(namedParam, function(match, optional) {
                                    return optional ? match : '([^/?]+)';
                                })
                               .replace(splatParam, '([^?]*?)');

            var flags = this.options.ignoreCase ? 'i' : null;

            // Allow the trailing slash to be optional
            if (this.options.appendSlash && route.charAt(route.length - 1) === '/') {
                routeRe = routeRe + '?';
            }

            return new RegExp('^' + routeRe + '(?:\\?([\\s\\S]*))?$', flags);
        },

        // Builds a flat map of dot-delimited names to the url,
        // e.g. resource.listing => /resources/
        _buildNameMap: function() {
            var name, route, root, url, prefix = '', map = {};

            if (this.options.name) {
                prefix = this.options.name + '.';
            }

            root = this.options.root;

            for (route in this.routes) {
                name = prefix + this.routes[route];
                url = Backbone.history.root + root + route;
                map[name] = url;
            }

            this._nameMap = map;
        },

        // Override to invalidate _nameMap
        route: function(route, name, callback) {
            // Check for sub-router options
            if (typeof name === 'object') {
                var options = _.clone(name);
                options.root = route;
                this.sub(options);
            }
            else {
                Backbone.Router.prototype.route.call(this, route, name, callback);
            }

            // Invalidate name map cache when a new route is added
            this._nameMap = null;
        },

        // Takes a name and returns the corresponding url. For urls that contain
        // variables, an `attrs` object may be passed to expand the url.
        reverse: function(name, attrs) {
            if (!this._nameMap) this._buildNameMap();

            var url = this._nameMap[name];

            if (url === undefined) {
                for (var r, i = 0; i < this.subs.length; i++) {
                    r = this.subs[i];
                    url = r.reverse(name, attrs);

                    if (url !== undefined) return url;
                }

                return;
            }

            var attr, regexp, params = url.match(param);

            _.each(params, function(param) {
                // Trim off the leading colon
                attr = param.slice(1);

                if (attrs && attrs.hasOwnProperty(attr)) {
                    regexp = new RegExp(param, 'g');
                    url = url.replace(regexp, attrs[attr]);
                }
            });

            return url;
        },

        // Initializes a sub-router to this router. The the name and root
        // will be indexed relative to this router's name and root.
        sub: function(options) {
            var Router = options.router;

            delete options.router;

            options.root = this.options.root + (options.root || '');
            options.app = this.app;

            var router = new Router(options);
            this.subs.push(router);

            return router;
        }
    });


    return {
        Router: Router
    };

});
