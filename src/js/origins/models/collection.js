/* global define */

define([
    './base',
    './resource'
], function(base, resource) {


    var Collection = base.Model.extend({
        name: 'Collection',

        initialize: function() {
            this.resources = resource.Resources(null, {
                url: function() {
                    return this.urls.resources;
                }.bind(this)
            });
        }
    });


    var Collections = base.Collection.extend({
        model: Collection
    });


    return {
        Collection: Collection,
        Collections: Collections
    };

});
