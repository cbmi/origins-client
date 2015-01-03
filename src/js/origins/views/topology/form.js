/* global define */

define([
    'jquery',
    'underscore',
    'marionette',

    'tpl!templates/topology/form.html'
], function($, _, Marionette, template) {

    var NewForm = Marionette.ItemView.extend({
        className: 'modal',

        template: template,

        ui: {
            title: '.modal-title',
            id: '[name=id]',
            label: '[name=label]',
            type: '[name=type]',
            description: '[name=description]',
            primary: '[name=primary]',
            cancel: '[name=cancel]',
            error: '[data-target=error]'
        },

        events: {
            'blur @ui.label': 'autofillId',
            'click @ui.cancel': 'handleCancel',
            'click @ui.primary': 'handlePrimary'
        },

        initialize: function() {
            _.bindAll(this, 'onSuccess', 'onError');
        },

        onRender: function() {
            // Hidden by default
            this.ui.error.hide();

            // Initialize modal
            this.$el.modal({
                backdrop: 'static',
                keyboard: false,
                show: false
            });
        },

        autofillId: function() {
            var label = this.ui.label.val();

            // alphanumeric, unders, hyphens
            var id = label.toLowerCase()
                .replace(/[^a-z0-9_-]+/g, '-')
                .replace(/^-/, '')
                .replace(/-$/, '');

            this.ui.id.val(id);
        },

        handleCancel: function() {
            this.hide();
        },

        handlePrimary: function() {
            this.save();
        },

        show: function(model) {
            if (model) {
                this.ui.title.text('Edit Resource');
                this.ui.primary.text('Save');
            }
            else {
                this.ui.title.text('New Resource');
                this.ui.primary.text('Create');
            }

            this._show(model);
        },

        _show: function(model) {
            this.model = model;

            var id, label, description, type;

            if (this.model) {
                id = this.model.get('id');
                label = this.model.get('label');
                description = this.model.get('description');
                type = this.model.get('type');
            }

            this.ui.id.val(id);
            this.ui.label.val(label);
            this.ui.description.val(description);
            this.ui.type.val(type);

            this.$el.modal('show');
        },

        hide: function() {
            this.$el.modal('hide');
            // Shouldn't need to do this.. bug in Bootstrap?
            $('body').removeClass('modal-open');
        },

        save: function() {
            this.ui.error.hide();

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

            if (this.model) {
                this.model.save(attrs, options);
            }
            else {
                options.url = _.result(this.collection, 'url');
                options.type = 'POST';
                this.collection.create(attrs, options);
            }

            this.hide();
        },

        onSuccess: function() {
            // Unbind model
            delete this.model;
        },

        onError: function(xhr) {
            this.show(this.model);
            var message = xhr.responseJSON.message;
            this.ui.error.html(message).show();
        }

    });


    return {
        NewForm: NewForm
    };

});
