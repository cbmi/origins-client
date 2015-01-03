/* global define */

define([
    './base'
], function(base) {


    var Link = base.Model.extend({
        name: 'Link'
    });


    var Links = base.Collection.extend({
        model: Link,

        // Default sort, most recently updated on top
        comparator: function(m) {
            return -m.attributes.time;
        }
    });


    return {
        Link: Link,
        Links: Links
    };

});
