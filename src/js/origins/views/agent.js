/* global define */

define([
    'marionette',
    './base'
], function(Marionette, base) {


    var AgentListItem = Marionette.ItemView.extend({
        tagName: 'li',

        template: 'agent/list-item',

        serializeData: function() {
            return {
                label: this.model.get('label'),
            };
        },

        behaviors: {
            TimeSince: {}
        }
    });

    var AgentList = base.CollectionView.extend({
        tagName: 'ul',

        childView: AgentListItem,

        options: {
            loadingMessage: 'Fetching agents...',
            emptyMessage: 'No agents available.'
        }
    });


    return {
        AgentListItem: AgentListItem,
        AgentList: AgentList
    };

});
