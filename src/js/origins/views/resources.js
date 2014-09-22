/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    '../core',
    './base',
    './components'
], function(_, Backbone, Marionette, origins, base, components) {


    var ResourceItem = Marionette.LayoutView.extend({
        template: 'resources/item',

        className: 'item resource-item',

        onRender: function() {

        }
    });


    var ResourceList = base.CollectionView.extend({
        childView: ResourceItem,

        options: {
            loadingMessage: 'Retrieving resources...',
            emptyMessage: 'No resources available.'
        }
    });


    var ResourcesPage = Marionette.LayoutView.extend({
        template: 'pages/resources',

        className: 'page',

        ui: {
            syncButton: '[data-action=sync]',
            fileInput: '[name=sync]'
        },

        events: {
            'click @ui.syncButton': 'triggerFile',
            'change @ui.fileInput': 'uploadFile'
        },

        regions: {
            resources: '[data-region=resources]'
        },

        onRender: function() {
            var resources = new ResourceList({
                collection: this.collection
            });

            this.resources.show(resources);
        },

        triggerFile: function() {
            this.ui.fileInput.trigger('click');
        },

        uploadFile: function() {
            var data = new FormData();

            var file = this.ui.fileInput.prop('files')[0];

            data.append('file', file, file.name);

            var xhr = Backbone.ajax({
                url: _.result(origins.store.resources, 'url') + 'sync/',
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false
            });

            var label = this.ui.syncButton.html();

            var syncing = '<i class="fa fa-circle-o-notch fa-spin"></i> Syncing "' +
                    file.name + '"...';

            this.ui.syncButton.html(syncing)
                .prop('disabled', true);

            var _this = this;

            xhr.always(function() {
                // Revert button back to initial label
                _this.ui.syncButton.html(label)
                    .prop('disabled', false);

                // Clear out value to ensure the change event fires for retries
                _this.ui.fileInput.val('');
            }).then(function(resp) {
                origins.store.resources.add(resp.resource);

                origins.notify({
                    timeout: false,
                    header: 'Synced "' + resp.resource.label + '" successfully',
                    message: JSON.stringify(resp.components, null, 4) + '\n\n' +
                        JSON.stringify(resp.relationships, null, 4)
                });
            }, function(resp) {
                origins.notify({
                    timeout: false,
                    header: 'Error syncing "' + file.name + '"',
                    message: unescape(resp.responseText)
                });
            });
        }
    });


    var ResourcePage = Marionette.LayoutView.extend({
        template: 'pages/resource',

        className: 'page',

        regions: {
            types: '[data-region=types]',
            components: '[data-region=components]'
        },

        onRender: function() {
            /*
            var types = new components.ComponentTypeList({
                collection: this.model.component_types  // jshint ignore:line
            });
            */

            var componentList = new components.ComponentList({
                collection: this.model.components
            });

            //this.types.show(types);
            this.components.show(componentList);
        }
    });


    return {
        ResourcePage: ResourcePage,
        ResourcesPage: ResourcesPage,
        ResourceItem: ResourceItem,
        ResourceList: ResourceList
    };

});
