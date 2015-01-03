/* global define, origins */

define([
    'marionette',
    '../base'
], function(Marionette, base) {


    var LinkCountListItem = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'resource/link-count-list-item',

        serializeData: function() {
            var attrs = this.model.toJSON();

            attrs.resource.url = origins.router.reverse('resource.index', attrs.resource);

            return attrs;
        }
    });


    // List of resources and their link counts
    var LinkCountList = base.CollectionView.extend({
        tagName: 'ul',

        childView: LinkCountListItem,

        options: {
            emptyMessage: 'Not connected to any resources.'
        }
    });


    return {
        LinkCountList: LinkCountList
    };

});
