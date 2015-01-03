/* global define */

define([
    'underscore',
    'backbone',
    'marionette',

    '../../app',

    'tpl!templates/resource/settings.html'
], function(_, Backbone, Marionette, app, template) {

    var Form = Marionette.LayoutView.extend({
        template: template,

        ui: {
            id: '[name=id]',
            label: '[name=label]',
            type: '[name=type]',
            description: '[name=description]',
            error: '[data-target=error]',
            save: '[data-action=save]',
        },

        events: {
            'click [data-action=cancel]': 'handleCancel',
            'click [data-action=save]': 'handlePrimary',
            'click [data-action=delete]': 'handleDelete'
        },

        initialize: function() {
            _.bindAll(this, 'onSuccess', 'onError');
        },

        handleCancel: function(event) {
            event.preventDefault();

            this.render();
        },

        handlePrimary: function(event) {
            event.preventDefault();

            this.save();
        },

        handleDelete: function(event) {
            event.preventDefault();

            this.model.destroy();

            Backbone.history.navigate(app.router.reverse('resource.listing'), {
                trigger: true
            });
        },

        onShow: function() {
            this.ui.error.hide();

            var id = this.model.get('id'),
                label = this.model.get('label'),
                description = this.model.get('description'),
                type = this.model.get('type');

            this.ui.id.val(id);
            this.ui.label.val(label);
            this.ui.description.val(description);
            this.ui.type.val(type);
        },

        save: function() {
            this.ui.error.hide();

            this.ui.save
                .prop('disabled', true)
                .text('Saving...');

            var attrs = {
                id: this.ui.id.val() || null,
                label: this.ui.label.val() || null,
                description: this.ui.description.val() || null,
                type: this.ui.type.val() || null
            };

            var options = {
                wait: true,
                success: this.onSuccess,
                error: this.onError
            };

            this.model.save(attrs, options);
        },

        onSuccess: function() {
            this.ui.save
                .prop('disabled', false)
                .html('<i class="fa fa-white fa-check"></i> Saved');

            setTimeout(function() {
                this.ui.save.text('Save');
            }.bind(this), 2000);
        },

        onError: function(xhr) {
            var message = xhr.responseJSON.message;
            this.ui.error.html(message).show();
        }

    });


    return {
        Form: Form
    };

});
