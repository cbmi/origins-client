/* global define */

define([
    'underscore',
    'marionette',

    '../app',
    '../utils',
    './base',

    'tpl!templates/feed/generation.html',
    'tpl!templates/feed/invalidation.html'
], function(_, Marionette, app, utils, base) {

    var templates = utils.templates([
        'generation',
        'invalidation'
    ], arguments, -2);


    var parseType = function(e) {
        return e.type || (e.properties ? e.properties['prov:type'] : null);
    };


    var parseLabel = function(e) {
        return e.label || (e.properties ? e.properties['prov:label'] : null);
    };


    var parseTime = function(t) {
        return t ? new Date(t) : null;
    };


    var parseEntity = function(e) {
        if (!e) return;

        var label = parseLabel(e),
            type = parseType(e);

        return {
            label: label,
            type: type,
            url: app.router.reverse('entity.index', e)
        };

    };


    var parseActivity = function(a) {
        if (!a) return;

        var p = a.properties;

        var label = parseLabel(a),
            type = parseType(a),
            startTime,
            endTime;

        if (p) {
            startTime = parseTime(p['prov:startTime']);
            endTime = parseTime(p['prov:endTime']);
        }

        return {
            label: label,
            type: type,
            startTime: startTime,
            endTime: endTime
        };
    };


    var parseAgent = function(a) {
        if (!a) return;

        var label = parseLabel(a),
            type = parseType(a);

        return {
            label: label,
            type: type
        };
    };


    var parseGeneration = function(g) {
        if (!g) return;

        var p = g.properties;

        var label = parseLabel(g),
            type = parseType(g),
            time = parseTime(p ? p['prov:time'] : null);

        return {
            label: label,
            type: type,
            time: time
        };
    };


    var parseDerivation = function(d) {
        if (!d) return;

        var label = parseLabel(d),
            type = parseType(d);

        return {
            label: label,
            type: type
        };
    };


    var parseAssociation = function(a) {
        if (!a) return;

        var role = a.association.properties['prov:role'] || '';

        if (_.isArray(role)) {
            role = role.join(', ');
        }

        return {
            agent: parseLabel(a.agent),
            role: role
        };
    };


    var parseGenerationEvent = function(attrs) {
        attrs.time = parseTime(attrs.time);

        attrs.generation = parseGeneration(attrs.generation);
        attrs.entity = parseEntity(attrs.entity);
        attrs.activity = parseActivity(attrs.activity);
        attrs.derivation = parseDerivation(attrs.derivation);
        attrs.usedEntity = parseEntity(attrs.used_entity);  // jshint ignore:line

        if (attrs.associations.length) {
            attrs.associations = attrs.associations.map(function(a) {
                return parseAssociation(a);
            });
        }
        else {
            attrs.associations = null;
        }

        return attrs;
    };


    var parseInvalidationEvent = function(attrs) {
        attrs.time = parseTime(attrs.time);

        attrs.invalidation = parseGeneration(attrs.invalidation);
        attrs.entity = parseEntity(attrs.entity);
        attrs.activity = parseActivity(attrs.activity);
        attrs.derivation = parseDerivation(attrs.derivation);
        attrs.generatedEntity = parseEntity(attrs.generated_entity);  // jshint ignore:line

        if (attrs.associations.length) {
            attrs.associations = attrs.associations.map(function(a) {
                return parseAssociation(a);
            });
        }
        else {
            attrs.associations = null;
        }

        return attrs;
    };


    var Event = Marionette.ItemView.extend({
        className: 'event',

        behaviors: {
            TimeSince: {}
        }
    });


    var Generation = Event.extend({
        template: templates.generation,

        serializeData: function() {
            var attrs = this.model.toJSON();

            return parseGenerationEvent(attrs);
        }
    });


    var Invalidation = Event.extend({
        template: templates.invalidation,

        serializeData: function() {
            var attrs = this.model.toJSON();

            return parseInvalidationEvent(attrs);
        }
    });


    var eventViews = {
        generation: Generation,
        invalidation: Invalidation
    };


    var List = base.CollectionView.extend({
        className: 'timeline',

        options: {
            loadingMessage: 'Loading timeline...',
            emptyHeader: 'Empty feed',
            emptyMessage: 'No events have been logged.'
        },

        getChildView: function(model) {
            return eventViews[model.get('type')];
        }

    });


    return {
        List: List
    };

});
