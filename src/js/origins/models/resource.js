/* global define */

define([
    './base',
    './entity',
    './link',
    './path',
    './feed'
], function(base, entity, link, path, feed) {


    var Resource = base.Model.extend({
        name: 'Resource',

        idAttribute: 'id',

        initialize: function() {
            this.entities = new entity.Entities(null, {
                url: function() {
                    return this.urls.entities;
                }.bind(this)
            });

            this.links = new link.Links(null, {
                url: function() {
                    return this.urls.links;
                }.bind(this)
            });

            this.paths = new path.Path(null, {
                url: function() {
                    return this.urls.paths;
                }.bind(this)
            });

            this.entityRoots = new entity.Entities(null, {
                url: function() {
                    return this.urls.entity_roots;  // jshint ignore:line
                }.bind(this)
            });

            this.feed = new feed.Feed(null, {
                url: function() {
                    return this.urls.feed;
                }.bind(this)
            });
        },

        parse: function(attrs) {
            attrs = base.Model.prototype.parse.call(this, attrs);
            if (!attrs) return;

            // Camelcase
            attrs.entityCount = attrs.entity_count;  // jshint ignore:line
            attrs.linkCount = attrs.link_count;  // jshint ignore:line

            // Add labels for the local counts
            attrs.entityLabel = attrs.entityCount === 1 ? 'entity' : 'entities';
            attrs.linkLabel = attrs.linkCount === 1 ? 'link' : 'links';

            return attrs;
        }
    });


    var Resources = base.Collection.extend({
        model: Resource,

        // Default sort, most recently updated on top
        comparator: function(m) {
            return -m.attributes.time;
        }
    });


    return {
        Resource: Resource,
        Resources: Resources
    };

});
