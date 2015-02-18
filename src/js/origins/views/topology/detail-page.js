define([
    'react',
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
    '../../components/topology-summary',
    '../../components/resource/entity-summary',

    'tpl!templates/topology/detail-page.html',
], function(React, Marionette, marked, app, utils, base, entity, feed, link, item, settings, TopologySummary, EntitySummary, template) {


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
            summary: 'showSummary',
            entities: 'showEntities',
            settings: 'showSettings'
        },

        defaultSection: 'summary',

        serializeData: function() {
            var attrs = this.model.toJSON();

            return {
                urls: {
                    index: app.router.reverse('topology.index', attrs),
                    entities: app.router.reverse('topology.entities', attrs),
                    settings: app.router.reverse('topology.settings', attrs)
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

        showSummary: function() {
            this.model.links.fetch().done(function() {
                var region = this.getRegion('content');
                region._ensureElement();

                var links = this.model.links.map(function(m) {
                    return m.attributes;
                });

                React.render(TopologySummary({
                    title: 'Summary',
                    links: links
                }), region.$el[0]);
            }.bind(this));
        },

        showPaths: function() {
            this.model.paths.fetch();

            var view = new entity.List({
                collection: this.model.paths
            });

            this.getRegion('content').show(view);
        },

        showEntities: function() {
            this.model.entities.fetch().done(function() {
                var region = this.getRegion('content');
                region._ensureElement();

                var entities = this.model.entities.map(function(m) {
                    return m.attributes;
                });

                React.render(EntitySummary({
                    title: 'Summary',
                    entities: entities,
                    description: false
                }), region.$el[0]);
            }.bind(this));
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
