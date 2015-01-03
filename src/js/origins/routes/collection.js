/* global define */

define([
    'underscore',
    './core',
    '../models',
    '../views/collection'
], function(_, core, models, collection) {

    var Router = core.Router.extend({
        routes: {
            '': 'listing',
            ':uuid/': 'index',
        },

        initialize: function() {
            this.collections = new models.Collections(null, {
                urls: {
                    self: this.app.router.links.collections
                }
            });
        },

        listing: function() {
            this.setTitle('Collections');

            var view = new collection.ListingPage({
                collection: this.collections
            });

            this.app.getRegion('main').show(view);
        },

        index: function(uuid) {
            var model = new models.Collection(null, {
                urls: {
                    self: this.app.router.linkTemplates.collection.expand({uuid: uuid})
                }
            });

            model.fetch().done(function(model) {
                this.setTitle(model.get('label'));

                model.resources.fetch();

                var view = new collection.DetailPage({
                    model: model
                });

                this.app.getRegion('main').show(view);
            }.bind(this));
        },
    });


    return {
        Router: Router
    };

});
