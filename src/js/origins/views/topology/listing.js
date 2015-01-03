/* global define */
define([
    'marionette',
    'marked',

    '../../app',
    '../base',
    './item'
], function(Marionette, marked, app, base, item) {


    var Listing = base.CollectionView.extend({
        childView: item.Item,

        className: 'listing'
    });


    return {
        Listing: Listing
    };

});
