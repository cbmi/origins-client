/* global define */

define([
    'marionette',
    'marked',

    '../../app',
    '../../utils',
    '../base',
    '../entity',
    '../feed',
    '../link',
    './item',
    './settings',

    'tpl!templates/topology/detail-page.html',
], function(Marionette, marked, app, utils, base, entity, feed, link, item, settings, template) {


    var DetailPage = Marionette.LayoutView.extend({
        template: template,

        ui: {
            nav: '[data-target=nav]',
        },

        behaviors: {
            TimeSince: {}
        },

        regions: {
            header: '[data-region=header]',
            content: '[data-region=content]'
        },

        sections: {
            links: 'showLinks',
            feed: 'showFeed',
            paths: 'showPaths',
            entities: 'showEntities',
            settings: 'showSettings',
            importer: 'showImporter'
        },

        defaultSection: 'links',

        serializeData: function() {
            var attrs = this.model.toJSON();

            return {
                urls: {
                    links: app.router.reverse('topology.links', attrs),
                    paths: app.router.reverse('topology.paths', attrs),
                    settings: app.router.reverse('topology.settings', attrs),
                    importer: app.router.reverse('topology.importer', attrs),
                    entities: app.router.reverse('topology.entities', attrs),
                    feed: app.router.reverse('topology.feed', attrs)
                }
            };
        },

        onShow: function() {
            this.showHeader();

            this.ui.nav.find('[href="' + utils.documentPath() + '"]')
                .parent().addClass('active');

            var section = this.options.section || this.defaultSection,
                method = this.sections[section];

            if (method) this[method]();
        },

        showHeader: function() {
            var view = new item.Item({
                model: this.model
            });

            this.getRegion('header').show(view);
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

            var view = new entity.List({
                collection: this.model.paths
            });

            this.getRegion('content').show(view);
        },

        showEntities: function() {
            this.model.entities.fetch();

            var view = new entity.List({
                collection: this.model.entities
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

        showSettings: function() {
            var view = new settings.Form({
                model: this.model
            });

            this.getRegion('content').show(view);
        },

        showImporter: function() {
            // TODO
            var view = new link.Form({
                collection: this.model.links
            });

            this.getRegion('content').show(view);
        }
    });


    return {
        DetailPage: DetailPage
    };

});
