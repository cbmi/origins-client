/* global define */

define([
    'jquery',
    'underscore',
    'backbone',
    '../store',
    '../links',
], function($, _, Backbone, store, links) {

    var Model = Backbone.Model.extend({
        name: 'Model',

        // Auto-generated id attribute on the server
        idAttribute: 'uuid',

        url: function() {
            if (this.urls && this.urls.self) {
                return this.urls.self;
            }

            var url = Backbone.Model.prototype.url.call(this);

            if (url.charAt(url.length - 1) !== '/') {
                url = url + '/';
            }

            return url;
        },

        sync: function(method, model, options) {
            var success = options.success;

            options.success = function(resp, status, xhr) {
                var _links = links.parse(xhr);

                if (_links.links) {
                    model.urls = _links.links;
                }

                if (_links.linkTemplates) {
                    model.urlTemplates = _links.linkTemplates;
                }

                if (success) success(resp, status, xhr);
            };

            return Backbone.sync(method, model, options);
        },

        toJSON: function() {
            var value, attrs = {};

            // Copy nested objects (one level deep)
            for (var key in this.attributes) {
                value = this.attributes[key];

                if (_.isObject(value)) {
                    value = _.clone(value);
                }

                attrs[key] = value;
            }

            return attrs;
        },

        constructor: function(attrs, options) {
            options = _.extend({store: true}, options);

            this.options = options;

            // Retrieve from store if available, otherwise add it if the ID
            // is defined which is used as the store key.
            var instance = store.get(this, attrs);

            if (instance) {
                return instance;
            }

            if (options) this.urls = options.urls;

            this.fetched = false;
            this.fetching = false;

            this.on('request', function(model, xhr) {
                var _this = this;
                this._deferred = $.Deferred();

                xhr.then(function() {
                    _this._deferred.resolveWith(model, [model]);
                }, function(xhr, status, error) {
                    _this._deferred.rejectWith(model, [model, error]);
                });

                this._promise = this._deferred.promise();
                this.fetching = true;
                this.fetched = false;
            });

            this.on('sync', function() {
                if (this.options.store) {
                    store.add(this);
                }

                this.fetching = false;
                this.fetched = true;
            });

            this.on('error', function() {
                this.fetching = false;
                this.fetched = false;
            });

            // Remove from cache when deleted
            this.on('destroy', function() {
                store.remove(this);
            });

            Backbone.Model.prototype.constructor.call(this, attrs, options);

            if (this.options.store && this.id !== undefined) {
                store.add(this);
            }
        },

        parse: function(attrs) {
            // Typically due to a 204 NO CONTENT response from
            // a PUT, PATCH, or DELETE
            if (!attrs) return;

            if (attrs.time) {
                attrs.parsedTime = new Date(attrs.time);
            }

            return attrs;
        },

        fetch: function(options) {
            options = options || {};

            if (!this.fetching && (!this.fetched || options.cached === false)) {
                Backbone.Model.prototype.fetch.apply(this, arguments);
            }

            return this._promise;
        }
    });


    var Collection = Backbone.Collection.extend({
        model: Model,

        constructor: function(attrs, options) {
            options = _.extend({store: true}, options);

            this.options = options;

            if (options.url) this.url = options.url;

            this.fetching = false;
            this.fetched = false;

            this.on('request', function(collection, xhr) {
                if (collection !== this) return;

                this._promise = xhr.promise();
                this.fetching = true;
                this.fetched = false;
            });

            // When a fetch occurs the reset event triggers before the sync
            // event, so this flag would not in the correct state if downstream
            // consumers relied on it. The solution is to update the flags if the
            // collection is in the process of fetching.
            this.on('reset sync', function(collection) {
                if (collection !== this) return;

                this.fetching = false;
                this.fetched = true;

                // Add models to store. However they are not marked as fetched
                // it should not be assumed *all data* for the model was retrieved
                // in the collection request.
                //collection.each(function(model) {
                //    store.add(model);
                //});
            });

            this.on('error', function(collection) {
                if (collection !== this) return;

                this.fetching = false;
                this.fetched = false;
            });

            Backbone.Collection.prototype.constructor.call(this, attrs, options);
        },

        sync: function(method, collection, options) {
            var success = options.success;

            options.success = function(resp, status, xhr) {
                var _links = links.parse(xhr);

                if (_links.links) {
                    collection.urls = _links.links;
                }

                if (_links.linkTemplates) {
                    collection.urlTemplates = _links.linkTemplates;
                }

                if (success) success(resp, status, xhr);
            };

            return Backbone.sync(method, collection, options);
        },

        modelLinks: function(attrs) {
            var links = {};

            _.each(this.urlTemplates, function(value, key) {
                links[key] = value.expand(attrs);
            });

            return links;
        },

        // Override prepare model to supply template links
        _prepareModel: function(attrs, options) {
            var idAttr = this.model.prototype.idAttribute;

            if (attrs instanceof Backbone.Model) {
                if (!attrs.collection) attrs.collection = this;

                // If this model is new and has not been synced, do not provide
                // the url links since they are not valid.
                if (attrs.get(idAttr) && !attrs.urls) {
                    attrs.urls = this.modelLinks(attrs);
                }

                return attrs;
            }

            options = options ? _.clone(options) : {};
            options.store = this.options.store;
            options.collection = this;

            if (attrs[idAttr]) {
                options.urls = this.modelLinks(attrs);
            }

            var model = new this.model(attrs, options);

            if (!model.validationError) return model;
            this.trigger('invalid', this, model.validationError, options);

            return false;
        },

        fetch: function(options) {
            options = options || {};

            if (!this.fetching && (!this.fetched || options.cached === false)) {
                Backbone.Collection.prototype.fetch.apply(this, arguments);
            }

            return this._promise;
        }
    });


    return {
        Model: Model,
        Collection: Collection
    };

});
