define([
    'marionette',
    'marked',

    '../../app',
    '../../utils',
    './path',

    'tpl!templates/entity/item.html'
], function(Marionette, marked, app, utils, path, template) {


    var Item = Marionette.LayoutView.extend({
        template: template,

        className: 'item item-entity',

        options: {
            time: true,
            resource: true,
            path: true,
            link: true,
            uuid: true,
            description: true
        },

        behaviors: {
            TimeSince: {}
        },

        regions: {
            path: '[data-region=path]'
        },

        templateHelpers: function() {
            return {
                showTime: this.getOption('time'),
                showLink: this.getOption('link'),
                showResource: this.getOption('resource'),
                showPath: this.getOption('path'),
                showUUID: this.getOption('uuid'),
                showDescription: this.getOption('description')
            };
        },

        serializeData: function() {
            var attrs = this.model.toJSON();

            attrs.url = app.router.reverse('entity.index', attrs);

            attrs.urls = {
                links: app.router.reverse('entity.links', attrs),
                feed: app.router.reverse('entity.feed', attrs),
                children: app.router.reverse('entity.children', attrs),
                properties: app.router.reverse('entity.properties', attrs)
            };

            attrs.resource.url = app.router.reverse('resource.index', attrs.resource);

            if (attrs.description) {
                attrs.description = marked(attrs.description);
            }

            return attrs;
        },

        onShow: function() {
            if (this.getOption('path') && this.model.path.length) {
                var pathRegion = this.getRegion('path');

                var view = new path.Path({
                    collection: this.model.path
                });

                pathRegion.show(view);
            }
        }
    });


    return {
        Item: Item
    };

});
