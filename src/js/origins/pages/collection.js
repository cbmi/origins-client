/* global define */

define([
    'marionette',
    '../views'
], function(Marionette, views) {


    var Collections = Marionette.LayoutView.extend({
        template: 'pages/collections',

        regions: {
            list: '[data-region=list]',
        },

        onShow: function() {
            var list = new views.CollectionList({
                collection: this.collection
            });

            this.list.show(list);
        },
    });

    return {
        Collections: Collections
    };

});
