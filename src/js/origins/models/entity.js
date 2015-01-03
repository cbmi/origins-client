/* global define */

define([
    'backbone',
    './base',
    './link',
    './feed'
], function(Backbone, base, link, feed) {


    var Entity = base.Model.extend({
        name: 'Entity',

        constructor: function() {
            // Entities making up *this* entity's path
            this.path = new Entities(null, {
                store: false
            });

            return base.Model.prototype.constructor.apply(this, arguments);
        },

        initialize: function() {
            this.links = new link.Links(null, {
                url: function() {
                    return this.urls.links;
                }.bind(this)
            });

            this.feed = new feed.Feed(null, {
                url: function() {
                    return this.urls.feed;
                }.bind(this)
            });

            this.children = new Entities(null, {
                url: function() {
                    return this.urls.children;
                }.bind(this)
            });
        },

        parse: function(attrs) {
            if (attrs && attrs.path) {
                this.path.reset(attrs.path);
            }

            if (!attrs.label) attrs.label = '(Unnamed)';

            attrs.linkCount = attrs['link_count'] || 0; // jshint ignore:line
            attrs.linkLabel = attrs.linkCount === 1 ? 'link' : 'links';

            return base.Model.prototype.parse.call(this, attrs);
        }
    });


    var Entities = base.Collection.extend({
        model: Entity
    });


    return {
        Entity: Entity,
        Entities: Entities
    };

});
