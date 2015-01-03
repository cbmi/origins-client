/* global define */

define([
    'underscore',
    './core',
    '../utils',
    '../models',
    '../views/topology'
], function(_, core, utils, models, topology) {

    var Router = core.Router.extend({

        routes: {
            '': 'listing',
            ':id/': 'index',
            ':id/links/': 'links',
            ':id/paths/': 'paths',
            ':id/entities/': 'entities',
            ':id/feed/': 'feed',
            ':id/importer/': 'importer',
            ':id/settings/': 'settings'
        },

        initialize: function() {
            // Initialize collection for the topology listing.
            this.topologies = new models.Topologies(null, {
                url: function() {
                    return this.app.links.topologies;
                }.bind(this)
            });
        },

        // Route for listing all topologies
        listing: function() {
            this.setTitle('Topologies');

            // Ensure the topologies are fetched
            this.topologies.fetch();

            var view = new topology.ListingPage({
                collection: this.topologies
            });

            this.app.getRegion('main').show(view);
        },

        detail: function(id, section) {
            var model = new models.Topology({id: id}, {
                urls: {
                    self: this.app.linkTemplates.topology.expand({id: id})
                }
            });

            return model.fetch().done(function(model) {
                this.setTitle(model.get('label'));

                var view = new topology.DetailPage({
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

        feed: function(id) {
            this.detail(id, 'feed');
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
