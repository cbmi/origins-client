/* global define */
define([
    'marionette',

    '../../utils',

    'tpl!templates/multi-entry.html',
    'tpl!templates/entity/form.html',
    'tpl!templates/entity/form/layout.html',
    'tpl!templates/entity/form/entity.html',
    'tpl!templates/entity/form/derivation.html',
    'tpl!templates/entity/form/usage.html',
    'tpl!templates/entity/form/association.html',
    'tpl!templates/entity/form/attribution.html',
    'tpl!templates/entity/form/properties.html'
], function(Marionette, utils) {

    var templates = utils.templates([
        'multi',
        'form',
        'layout',
        'entity',
        'derivation',
        'usage',
        'association',
        'attribution',
        'properties'
    ], arguments, 2);


    var MultiEntry = Marionette.CompositeView.extend({
        template: templates.multi,

        childViewContainer: '[data-target=items]',

        ui: {
            add: '[data-action=add]'
        },

        events: {
            'click @ui.add': 'handleAdd',
        },

        handleAdd: function(event) {
            event.preventDefault();

            this.collection.add({});
        }
    });


    var Derivation = Marionette.ItemView.extend({
        template: templates.derivation,

        ui: {
            entity: '[data-target=entity]',
            type: '[data-target=type]'
        },

        onRender: function() {
            this.ui.entity.val(this.model.get('entity') || '');
            this.ui.type.val(this.model.get('type') || '');
        }
    });


    var Usage = Marionette.ItemView.extend({
        template: templates.usage,

        ui: {
            entity: '[data-target=entity]',
            type: '[data-target=type]'
        },

        onRender: function() {
            this.ui.entity.val(this.model.get('entity') || '');
            this.ui.type.val(this.model.get('type') || '');
        }
    });


    var Association = Marionette.ItemView.extend({
        template: templates.association,

        ui: {
            agent: '[data-target=agent]',
            role: '[data-target=role]'
        },

        onRender: function() {
            this.ui.agent.val(this.model.get('agent') || '');
            this.ui.role.val(this.model.get('role') || '');
        }
    });

    var Attribution = Marionette.ItemView.extend({
        template: templates.attribution,

        ui: {
            agent: '[data-target=agent]',
            type: '[data-target=type]'
        },

        onRender: function() {
            this.ui.agent.val(this.model.get('agent') || '');
            this.ui.type.val(this.model.get('type') || '');
        }
    });

    var Entity = Marionette.ItemView.extend({
        template: templates.entity,

        ui: {
            label: '[name=label]',
            type: '[name=type]',
            description: '[name=description]',
            created: '[name=created]',
            activity: '[name=activity]'
        },

        onRender: function() {
            this.ui.agent.val(this.model.get('agent') || '');
            this.ui.type.val(this.model.get('type') || '');
        }
    });

    var Activity = Marionette.ItemView.extend({
        template: templates.activity,

        ui: {
            type: '[name=type]',
            startTime: '[name=start-time]',
            endTime: '[name=end-time]'
        },

        onRender: function() {
            this.ui.type.val(this.model.get('type') || '');
            this.ui.startTime.val(this.model.get('startTime') || '');
            this.ui.endTime.val(this.model.get('endTime') || '');
        }
    });


    var Properties = Marionette.ItemView.extend({
        template: templates.properties,

        ui: {
            key: '[data-target=key]',
            value: '[data-target=value]'
        }
    });


    var Layout = Marionette.LayoutView.extend({
        template: templates.layout,

        regions: {
            entity: '[data-region=entity]',
            properties: '[data-region=properties]',
            derivation: '[data-region=derivation]',
            attribution: '[data-region=attribution]',
            activity: '[data-region=activity]',
            association: '[data-region=association]',
            usage: '[data-region=usage]'
        },

        onShow: function() {
            var entity = new Entity({
                model: this.model
            });

            var properties = new Properties({
                model: this.model
            });

            var derivation = new Derivation({
                model: this.model
            });

            var attribution = new Attribution({
                model: this.model
            });

            var activity = new Activity({
                model: this.model
            });

            var association = new Association({
                model: this.model
            });

            var usage = new Usage({
                model: this.model
            });

            this.getRegion('entity').show(entity);
            this.getRegion('properties').show(properties);
            this.getRegion('derivation').show(derivation);
            this.getRegion('attribution').show(attribution);
            this.getRegion('activity').show(activity);
            this.getRegion('association').show(association);
            this.getRegion('usage').show(usage);
        },
    });


    var Form = Marionette.LayoutView.extend({
        className: 'modal',

        template: templates.modal,

        onShow: function() {
            this.$el.modal({
                show: false,
                background: 'static',
                keyboard: false
            });
        },

        open: function() {
            this.$el.modal('show');
        },

        close: function() {
            this.$el.modal('hide');
        }
    });


    return {
        Form: Form,
        MultiEntry: MultiEntry,
        Layout: Layout
    };

});
