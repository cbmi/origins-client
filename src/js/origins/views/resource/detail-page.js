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

    'tpl!templates/resource/detail-page.html',
    'tpl!templates/resource/entities.html',
], function(Marionette, marked, app, utils, base, entity, feed, link, item, settings) {


    var templates = utils.templates([
        'detail',
        'entities'
    ], arguments, -2);


    var Entities = Marionette.LayoutView.extend({
        template: templates.entities,

        ui: {
            open: '[data-action=open-form]'
        },

        events: {
            'click @ui.open': 'showModal'
        },

        regions: {
            list: '[data-region=list]',
            //modal: '[data-region=modal]'
        },

        onShow: function() {
            var list = new entity.List({
                collection: this.model.entities,
                // Hide resource since this *is* the resource page
                childViewOptions: {
                    resource: false
                }
            });

            //var modal = new entity.Form({
            //    model: this.model
            //});

            this.getRegion('list').show(list);
            //this.getRegion('modal').show(modal);
        },

        showModal: function() {
            this.getRegion('modal').currentView.open();
        }
    });


    var DetailPage = Marionette.LayoutView.extend({
        template: templates.detail,

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
            index: 'showFeed',
            links: 'showLinks',
            paths: 'showPaths',
            entities: 'showEntities',
            settings: 'showSettings',
            importer: 'showImporter'
        },

        serializeData: function() {
            var attrs = this.model.toJSON();

            return {
                urls: {
                    links: app.router.reverse('resource.links', attrs),
                    paths: app.router.reverse('resource.paths', attrs),
                    settings: app.router.reverse('resource.settings', attrs),
                    importer: app.router.reverse('resource.importer', attrs),
                    entities: app.router.reverse('resource.entities', attrs),
                    feed: app.router.reverse('resource.feed', attrs)
                }
            };
        },

        onShow: function() {
            this.showHeader();

            this.ui.nav.find('[href="' + utils.documentPath() + '"]')
                .parent().addClass('active');

            var section = this.options.section || 'index',
                method = this.sections[section];

            if (method) this[method]();
        },

        showHeader: function() {
            var header = new item.Item({
                model: this.model,
                link: false
            });

            this.getRegion('header').show(header);
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

            var view = new Entities({
                model: this.model
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
            var view = new Marionette.View({
                model: this.model
            });

            this.getRegion('content').show(view);
        }
    });


    return {
        DetailPage: DetailPage
    };

});
