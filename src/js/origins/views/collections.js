/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    '../core',
    './base',
    './resources'
], function(_, Backbone, Marionette, origins, base, resources) {


    var CollectionItem = Marionette.ItemView.extend({
        template: 'collections/item',

        className: 'item collection-item'
    });


    var CollectionList = base.CollectionView.extend({
        childView: CollectionItem,

        className: 'card-layout',

        options: {
            loadingMessage: 'Fetching collections...',
            emptyMessage: 'No collections have been created.'
        }
    });


    var CollectionPage = Marionette.LayoutView.extend({
        template: 'pages/collection',

        className: 'page',

        regions: {
            list: '[data-region=list]'
        },

        onRender: function() {
            var list = new resources.ResourceList({
                collection: this.model.resources
            });

            this.list.show(list);

            this.model.resources.ensure();
        }
    });


    var CollectionModal = Marionette.LayoutView.extend({
        className: 'modal',

        template: 'collections/modal',

        ui: {
            labelInput: '[name=label]',
            descriptionInput: '[name=description]',
            resourcesInput: '[name=resources]',
            saveButton: '[data-action=save]',
            cancelButton: '[data-action=cancel]'
        },

        events: {
            'click @ui.saveButton': 'save',
            'click @ui.cancelButton': 'cancel'
        },

        onRender: function() {
            this.$el.modal({
                show: false,
                keyboard: false,
                backdrop: 'static'
            });
        },

        save: function() {
            this.hide();

            var _this = this;

            var model = new origins.store.collections.model({
                label: this.ui.labelInput.val(),
                description: this.ui.descriptionInput.val()
                //resources: this.ui.resourcesInput.val()
            });

            console.log(model);

            if (!model.isValid()) {
                console.log('error');
                return;
            }

            origins.store.collections.add(model);

            model.save().then(function() {
                // success..
                _this.reset();

            }, function() {
                // failure...
                _this.show();

            });
        },

        reset: function() {
            this.ui.labelInput.val();
        },

        cancel: function() {
            this.hide();
            this.reset();
        },

        show: function() {
            this.$el.modal('show');
        },

        hide: function() {
            this.$el.modal('hide');
        }
    });


    var CollectionsPage = Marionette.LayoutView.extend({
        template: 'pages/collections',

        className: 'page',

        ui: {
            addButton: '[data-action=add]'
        },

        events: {
            'click @ui.addButton': 'openModal'
        },

        regions: {
            list: '[data-region=list]',
            modal: '[data-region=modal]'
        },

        onRender: function() {
            var list = new CollectionList({
                collection: this.collection
            });

            var modal = new CollectionModal({
                collection: origins.store.resources
            });

            this.list.show(list);
            this.modal.show(modal);

            this.collection.ensure();
        },

        openModal: function() {
            this.modal.currentView.show();
        }
    });


    return {
        CollectionPage: CollectionPage,
        CollectionsPage: CollectionsPage
    };

});
