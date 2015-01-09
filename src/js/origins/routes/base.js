/* global define */

define([
    'react',
    '../components/index',
    '../views/search',
    '../models',
    './core'
], function(React, index, search, models, core) {

    var Router = core.Router.extend({
        routes: {
            '': 'index',

            'search/': 'search'
        },

        index: function() {
            this.setTitle('');

            var main = this.app.getRegion('main');

            React.render(index.IndexPage(), main.$el[0]);
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
