/* global define */

define([
    'underscore',
    './core',
    '../models',
    '../views/link'
], function(_, core, models, link) {

    var Router = core.Router.extend({
        routes: {
            ':uuid/': 'index',
            ':uuid/:section/': 'index',
        },

        section: function(uuid, section) {
            var model = new models.Link({uuid: uuid}, {
                urls: {
                    self: this.app.linkTemplates.link.expend({uuid: uuid})
                }
            });

            var view = new link.DetailPage({
                model: model,
                section: section
            });

            model.fetch().done(function() {
                this.setTitle(model.get('label'));

                this.app.getRegion('main').show(view);
            }.bind(this));
        },

        index: function(uuid) {
            this.section(uuid);
        }
    });


    return {
        Router: Router
    };

});
