/* global define, origins */

define([
    'marionette',
    'backbone'
], function(Marionette, Backbone) {

    var Form = Marionette.LayoutView.extend({
        template: 'resource/importer-form',

        ui: {
            syncButton: '[data-action=sync]',
            fileInput: '[name=sync]'
        },

        events: {
            'change @ui.fileInput': 'importFile'
        },

        triggerFile: function() {
            this.ui.fileInput.trigger('click');
        },

        importFile: function() {
            var data = new FormData();

            var file = this.ui.fileInput.prop('files')[0];

            data.append('file', file, file.name);

            var xhr = Backbone.ajax({
                url: this.model.urls.importer,
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
                var text;

                try {
                    text = JSON.parse(resp.responseText).message;
                }
                catch (e) {
                    text = resp.responseText;
                }

                /*origins.notify({
                    timeout: false,
                    level: 'warning',
                    header: 'Error syncing "' + file.name + '"',
                    message: '<pre>' + text + '</pre>'
                });
                */
            });
        }
    });


    return {
        Form: Form
    };

});
