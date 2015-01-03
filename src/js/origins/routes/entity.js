/* global define */

define([
    'underscore',
    './core',
    '../models',
    '../views/entity'
], function(_, core, models, entity) {

    var Router = core.Router.extend({
        routes: {
            ':uuid/': 'index',
            ':uuid/properties/': 'properties',
            ':uuid/links/': 'links',
            ':uuid/children/': 'children',
            ':uuid/feed/': 'feed'
        },

        detail: function(uuid, section) {
            var model = new models.Entity({uuid: uuid}, {
                urls: {
                    self: this.app.linkTemplates.entity.expand({uuid: uuid})
                }
            });

            return model.fetch().done(function() {
                this.setTitle(model.get('label'));

                var view = new entity.DetailPage({
                    model: model,
                    section: section
                });

                this.app.getRegion('main').show(view);
            }.bind(this));
        },

        index: function(uuid) {
            this.detail(uuid).done(function(model) {
                model.feed.fetch();
            });
        },

        properties: function(uuid) {
            this.detail(uuid, 'properties');
        },

        links: function(uuid) {
            this.detail(uuid, 'links').done(function(model) {
                model.links.fetch();
            });
        },

        children: function(uuid) {
            this.detail(uuid, 'children').done(function(model) {
                model.children.fetch();
            });
        }
    });


    return {
        Router: Router
    };

});
