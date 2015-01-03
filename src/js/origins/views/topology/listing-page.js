/* global define */

define([
    'marionette',

    './form',
    './listing',

    'tpl!templates/topology/listing-page.html'
], function(Marionette, form, listing, template) {

    // The ListingPage displays a list of topologies and a form modal.
    var ListingPage = Marionette.LayoutView.extend({
        template: template,

        events: {
            'click [data-target=modal-button]': 'handleOpenModal',
        },

        regions: {
            list: '[data-region=list]',
            modal: '[data-region=modal]'
        },

        onShow: function() {
            var resources = new listing.Listing({
                collection: this.collection
            });

            var modal = new form.NewForm({
                collection: this.collection
            });

            this.getRegion('list').show(resources);
            this.getRegion('modal').show(modal);
        },

        handleOpenModal: function() {
            this.getRegion('modal').currentView.show();
        }
    });


    return {
        ListingPage: ListingPage
    };

});
