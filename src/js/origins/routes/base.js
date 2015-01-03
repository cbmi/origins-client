/* global define */

define([
    '../views/index',
    '../views/search',
    '../models',
    './core'
], function(index, search, models, core) {

    var Router = core.Router.extend({
        routes: {
            '': 'index',

            'search/': 'search'
        },

        index: function() {
            this.setTitle('');

            var view = new index.IndexPage();

            this.app.getRegion('main').show(view);
        },

        search: function() {
            this.setTitle('Search');

            // Entities collection for search
            var entities = new models.Entities(null, {
                url: function() {
                    return this.app.links.entities;
                }.bind(this)
            });

            // TODO initialize search collection/model
            var view = new search.SearchPage({
                collection: entities
            });

            this.app.getRegion('main').show(view);
        }

    });

    return {
        Router: Router
    };

});
