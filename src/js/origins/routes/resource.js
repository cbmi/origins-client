/* global define */

define([
    'underscore',
    './core',
    '../utils',
    '../models',
    '../views/resource'
], function(_, core, utils, models, resource) {

    var Router = core.Router.extend({

        routes: {
            '': 'listing',
            ':id/': 'index',
            ':id/entities/': 'entities',
            ':id/links/': 'links',
            ':id/paths/': 'paths',
            ':id/importer/': 'importer',
            ':id/settings/': 'settings'
        },

        initialize: function() {
            // Initialize collection for the resource listing.
            this.resources = new models.Resources(null, {
                url: function() {
                    return this.app.links.resources;
                }.bind(this)
            });
        },

        // Route for listing all resources
        listing: function() {
            this.setTitle('Resources');

            // Ensure the resources are fetched
            this.resources.fetch();

            var view = new resource.ListingPage({
                collection: this.resources
            });

            this.app.getRegion('main').show(view);
        },

        detail: function(id, section) {
            var model = new models.Resource({id: id}, {
                urls: {
                    self: this.app.linkTemplates.resource.expand({id: id})
                }
            });

            return model.fetch().done(function(model) {
                this.setTitle(model.get('label'));

                var view = new resource.DetailPage({
                    model: model,
                    section: section
                });

                this.app.main.show(view);
            }.bind(this));
        },

        index: function(id) {
            this.detail(id);
        },

        entities: function(id) {
            this.detail(id, 'entities');
        },

        links: function(id) {
            this.detail(id, 'links');
        },

        paths: function(id) {
            this.detail(id, 'paths');
        },

        importer: function(id) {
            this.detail(id, 'importer');
        },

        settings: function(id) {
            this.detail(id, 'settings');
        }
    });


    return {
        Router: Router
    };

});
