/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    './base'
], function(_, Backbone, Marionette, base) {


    var ReferencedRelationshipItem = Marionette.ItemView.extend({
        template: 'relationships/item',

        initialize: function(options) {
            this.reference = options.reference;
        },

        serializeData: function() {
            var data = this.model.toJSON();

            data.outgoing = this.reference.get('uuid') === data.start.uuid;

            return data;
        }
    });


    var ReferencedRelationshipList = base.CollectionView.extend({
        childView: ReferencedRelationshipItem,

        options: {
            loadingMessage: 'Loading relationships...',
            emptyMessage: 'No related components'
        },

        initialize: function(options) {
            this.reference = options.reference;
        },

        childViewOptions: function(model, index) {
            return {
                model: model,
                index: index,
                reference: this.reference
            };
        }
    });


    return {
        ReferencedRelationshipItem: ReferencedRelationshipItem,
        ReferencedRelationshipList: ReferencedRelationshipList
    };

});
