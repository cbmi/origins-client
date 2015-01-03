/* global define */

define([
    './base'
], function(base) {


    var Event = base.Model.extend({
        name: 'Event'
    });


    var Feed = base.Collection.extend({
        model: Event
    });


    return {
        Event: Event,
        Feed: Feed
    };

});
