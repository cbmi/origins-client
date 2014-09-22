/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    './base',
    './relationships'
], function(_, Backbone, Marionette, base, relationships) {


    var RevisionItem = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'revision-item'
    });


    var ComponentItem = Marionette.ItemView.extend({
        template: 'components/item',

        className: 'item component-item'
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
            emptyMessage: 'Component does not have any sources.'
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

        regions: {
            properties: '[data-region=properties]',
            relationships: '[data-region=relationships]',
            revisions: '[data-region=revisions]',
            timeline: '[data-region=timeline]',
            sources: '[data-region=sources]'
        },

        onRender: function() {
            var properties = new PropertiesTable({
                model: this.model.properties
            });

            var rels = new relationships.ReferencedRelationshipList({
                collection: this.model.relationships,
                reference: this.model
            });

            var sources = new ComponentSourceList({
                collection: this.model.sources
            });

            var timeline = new TimelineList({
                collection: this.model.timeline
            });

            var revisions = new ComponentList({
                tagName: 'ul',
                childView: RevisionItem,
                collection: this.model.revisions
            });

            // Ensure the related items are fetched
            //this.model.relationships.ensure();
            //this.model.sources.ensure();
            //this.model.timeline.ensure();
            //this.model.revisions.ensure();

            //this.path.show(path);
            this.properties.show(properties);
            //this.relationships.show(rels);
            //this.sources.show(sources);
            //this.timeline.show(timeline);
            this.revisions.show(revisions);
        }
    });



    return {
        ComponentItem: ComponentItem,
        ComponentList: ComponentList,
        ComponentPage: ComponentPage
        //ComponentTypeList: ComponentTypeList
    };

});
