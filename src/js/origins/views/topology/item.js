/* global define */
define([
    'marionette',
    'marked',

    '../../app',

    'tpl!templates/topology/item.html'
], function(Marionette, marked, app, template) {


    var Item = Marionette.LayoutView.extend({
        template: template,

        className: 'item item-topology',

        options: {
            link: true
        },

        behaviors: {
            TimeSince: {}
        },

        modelEvents: {
            'change': 'render'
        },

        templateHelpers: function() {
            return {
                showLink: this.getOption('link')
            };
        },

        serializeData: function() {
            var attrs = this.model.toJSON();

            attrs.url = app.router.reverse('topology.index', attrs);

            if (!attrs.label) {
                attrs.label = '(Unamed)';
            }

            if (attrs.description) {
                attrs.description = marked(attrs.description);
            }

            attrs.urls = {
                entities: app.router.reverse('topology.entities', attrs),
                links: app.router.reverse('topology.links', attrs)
            };

            return attrs;
        }
    });


    return {
        Item: Item
    };

});
