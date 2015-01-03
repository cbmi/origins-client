/* global define */

define([
    'marionette',
    './base'
], function(Marionette, base) {


    var CollectionListItem = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'collections/list-item',

        serializeData: function() {
            return {
                url: '/resources/' + this.model.get('uuid') + '/',
                label: this.model.get('label'),
                description: this.model.get('description')
            };
        },
    });


    var CollectionList = base.CollectionView.extend({
        tagName: 'ul',

        childView: CollectionListItem,

        options: {
            emptyMessage: 'No collections have been created.'
        }
    });


    return {
        CollectionListItem: CollectionListItem,
        CollectionList: CollectionList
    };

});
