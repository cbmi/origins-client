/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    '../utils',
    './base',
    './relationships'
], function(_, Backbone, Marionette, utils, base, relationships) {


    var RevisionItem = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'revision-item'
    });


    var ComponentItem = Marionette.ItemView.extend({
        template: 'components/item',

        className: 'item component-item',

        behaviors: {
            TimeSince: {}
        }
    });

    var ComponentList = base.CollectionView.extend({
        childView: ComponentItem,

        options: {
            loadingMessage: 'Retrieving components...',
            emptyMessage: 'No components available.'
        }
    });


    var PropertiesTable = Marionette.ItemView.extend({
        template: 'properties-table',

        serializeData: function() {
            var data = this.model.toJSON();

            _.each(data, function(value, key) {
                if (_.isObject(value)) {
                    var html = ['<ul style="padding-left:15px">'];

                    if (_.isArray(value)) {
                        _.each(value, function(v) {
                            html.push('<li>' + v + '</li>');
                        });
                    }
                    else {
                        _.each(value, function(v, k) {
                            html.push('<li>' + k + ': ' + v + '</li>');
                        });
                    }

                    html.push('</ul>');

                    data[key] = html.join('');
                }

            });

            return data;
        }
    });

    var ComponentSourceItem = Marionette.ItemView.extend({
        template: 'components/source-item'
    });

    var ComponentSourceList = base.CollectionView.extend({
        childView: ComponentSourceItem,

        options: {
            loadingMessage: 'Loading sources...',
            emptyMessage: 'Component does not have any known sources.'
        }
    });


    var TimelineListItem = Marionette.ItemView.extend({
        template: 'timeline-list-item'
    });


    var TimelineList = base.CollectionView.extend({
        childView: TimelineListItem,

        options: {
            loadingMessage: 'Loading timeline...',
            emptyMessage: 'Timeline not available.'
        }
    });


    var ComponentPage = Marionette.LayoutView.extend({
        template: 'pages/component',

        className: 'page component-page',

        ui: {
            nav: '[data-target=nav]',
            sections: '[data-target=sections]'
        },

        regions: {
            path: '[data-region=path]',
            content: '[data-region=content]',
        },

        sections: {
            'summary': 'renderSummary',
            'properties': 'renderProperties',
            'sources': 'renderSources',
            'derivatives': 'renderDerivatives',
            'relationships': 'renderRelationships',
            'revisions': 'renderRevisions',
            'timeline': 'renderTimeline',
        },

        onShow: function() {
            this.ui.nav.find('[href="' + utils.documentPath() + '"]')
                .parent().addClass('active');

            var section = this.options.section || 'summary',
                method = this.sections[section];

            if (method) {
                this[method]();
            }
            else {
                var view = new base.ErrorPage({
                    message: 'Page not found :('
                });

                this.content.show(view);
            }

            //this.path.show(path);
        },

        renderSummary: function() {

        },

        renderProperties: function() {
            var view = new PropertiesTable({
                model: this.model.properties
            });

            this.content.show(view);
        },

        renderRelationships: function() {
            this.model.relationships.ensure();

            var view = new relationships.ReferencedRelationshipList({
                collection: this.model.relationships,
                reference: this.model
            });

            this.content.show(view);
        },

        renderSources: function() {
            //this.model.sources.ensure();

            var view = new ComponentSourceList({
                collection: this.model.sources
            });

            this.content.show(view);
        },

        renderDerivatives: function() {

        },

        renderTimeline: function() {
            //this.model.timeline.ensure();

            var view = new TimelineList({
                collection: this.model.timeline
            });

            this.content.show(view);
        },

        renderRevisions: function() {
            this.model.revisions.ensure();

            var view = new ComponentList({
                tagName: 'ul',
                childView: RevisionItem,
                collection: this.model.revisions
            });

            this.content.show(view);
        }
    });



    return {
        ComponentItem: ComponentItem,
        ComponentList: ComponentList,
        ComponentPage: ComponentPage
        //ComponentTypeList: ComponentTypeList
    };

});
