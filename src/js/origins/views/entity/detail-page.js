define([
    'react',
    'marionette',

    '../../app',
    '../../utils',

    '../feed',
    '../link',
    './item',
    './list',
    './properties',

    '../../components/resource/entity-summary',
    '../../components/topology-summary',

    'tpl!templates/entity/detail-page.html'
], function(React, Marionette, app, utils, feed, link, item, list, properties, EntitySummary, TopologySummary, template) {

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
            'links': 'showLinks',
            'properties': 'showProperties',
            'children': 'showChildren'
        },

        behaviors: {
            TimeSince: {}
        },

        serializeData: function() {
            var attrs = this.model.toJSON();

            // Urls
            attrs.url = app.router.reverse('entity.index', attrs);

            attrs.urls = {
                index: app.router.reverse('entity.index', attrs),
                links: app.router.reverse('entity.links', attrs),
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
            this.model.children.fetch().done(function() {
                var region = this.getRegion('content');
                region._ensureElement();

                var entities = this.model.children.map(function(m) {
                    return m.attributes;
                });

                React.render(EntitySummary({
                    title: 'Children',
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

        showLinks: function() {
            this.model.links.fetch().done(function() {
                var region = this.getRegion('content');
                region._ensureElement();

                var links = this.model.links.map(function(m) {
                    return m.attributes;
                });

                React.render(TopologySummary({
                    title: 'Links',
                    links: links
                }), region.$el[0]);
            }.bind(this));
        }
    });


    return {
        DetailPage: DetailPage
    };

});
