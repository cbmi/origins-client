/* global define */

define([
    '../base',
    './item'
], function(base, item) {


    var List = base.CollectionView.extend({
        childView: item.Item,

        options: {
            emptyMessage: 'No entities available.'
        }
    });


    return {
        List: List
    };

});
