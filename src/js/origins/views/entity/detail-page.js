/* global define */

define([
    'marionette',

    '../../app',
    '../../utils',

    '../feed',
    '../link',
    './item',
    './list',
    './properties',

    'tpl!templates/entity/detail-page.html'
], function(Marionette, app, utils, feed, link, item, list, properties, template) {

    var DetailPage = Marionette.LayoutView.extend({
        template: template,

        ui: {
            nav: '[data-target=nav]',
            sections: '[data-target=sections]'
        },

        regions: {
            header: '[data-region=header]',
            content: '[data-region=content]'
        },

        sections: {
            'index': 'showFeed',
            'properties': 'showProperties',
            'children': 'showChildren',
            'links': 'showLinks',
            'paths': 'showPaths'
        },

        behaviors: {
            TimeSince: {}
        },

        serializeData: function() {
            var attrs = this.model.toJSON();

            // Urls
            attrs.url = app.router.reverse('entity.index', attrs);

            attrs.urls = {
                links: app.router.reverse('entity.links', attrs),
                feed: app.router.reverse('entity.feed', attrs),
                children: app.router.reverse('entity.children', attrs),
                properties: app.router.reverse('entity.properties', attrs)
            };

            attrs.resource.url = app.router.reverse('resource.index', attrs.resource);

            return attrs;
        },

        onShow: function() {
            var view = new item.Item({
                model: this.model,
                link: false
            });

            this.getRegion('header').show(view);

            this.ui.nav.find('[href="' + utils.documentPath() + '"]')
                .parent().addClass('active');

            var section = this.options.section || 'index',
                method = this.sections[section];

            if (method) this[method]();
        },

        showProperties: function() {
            var view = new properties.Table({
                model: this.model
            });

            this.getRegion('content').show(view);
        },

        showChildren: function() {
            this.model.children.fetch();

            var view = new list.List({
                collection: this.model.children
            });

            this.getRegion('content').show(view);
        },

        showFeed: function() {
            this.model.feed.fetch();

            var view = new feed.List({
                collection: this.model.feed
            });

            this.getRegion('content').show(view);
        },

        showLinks: function() {
            this.model.links.fetch();

            var view = new link.Table({
                collection: this.model.links
            });

            this.getRegion('content').show(view);
        },

        showPaths: function() {
            this.model.paths.fetch();

            var view = new path.List({
                collection: this.model.paths
            });

            this.getRegion('content').show(view);
        }
    });


    return {
        DetailPage: DetailPage
    };

});
