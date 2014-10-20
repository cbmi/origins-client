/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
    './resources',
    './components',
    './relationships'
], function(_, Backbone, Marionette, resources, components, relationships) {


    /*
    Grammar:
    - optional prefix [+-]
    - optional property name, quoted if contains whitespace
    - property value, quoted if contains whitespace

    Examples:
    - 'foo'
    - '-foo'
    - '+origins:type="foo bar"
    */

    /* jshint ignore:start */

    var searchRegex = /(?:([+-])?(?:([^\s"']+|"[^"]+"|'[^']+')=)?([^\s"']+|"[^"]+"|'[^']+'))+/ig;

    var parseInputString = function(text) {
        var matches = [], match = searchRegex.exec(text);

        while (match) {
            matches.push({
                value: match[3],
                property: match[2],
                operator: match[1]
            });

            match = searchRegex.exec(text);
        }

        return matches;
    };

    /* jshint ignore:end */

    var SearchInput = Marionette.View.extend({
        tagName: 'input',

        className: 'form-control',

        attributes: {
            type: 'search',
            autocomplete: 'off',
            placeholder: 'Search...'
        },

        events: {
            'input': '_handleChange',
            'keypress': '_submit'
        },

        initialize: function() {
            this._handleChange = _.debounce(this.handleChange, 400);
            // Fire the first call and debounce all the rest
            this._submit = _.debounce(this.submit, 400, true);
        },

        handleChange: function(event) {
            event.preventDefault();
            this.trigger('search', this.el.value);
        },

        submit: function(event) {
            if (event.which === 13) {
                this.trigger('search', this.el.value);
            }
        },

        set: function(value) {
            if (this.el.value !== value) {
                this.el.value = value;
                this.trigger('search', value);
            }
        }
    });


    var SearchPage = Marionette.LayoutView.extend({
        template: 'pages/search',

        className: 'page',

        ui: {
            resourceCount: '[data-target=#search-resources]',
            componentCount: '[data-target=#search-components]',
            relationshipCount: '[data-target=#search-relationships]',
        },

        regions: {
            resources: '[data-region=resources]',
            components: '[data-region=components]',
            relationships: '[data-region=relationships]'
        },

        onShow: function() {
            this.bindCollection({
                collection: this.model.resources,
                element: this.ui.resourceCount,
                single: 'resource',
                plural: 'resources'
            });

            this.bindCollection({
                collection: this.model.components,
                element: this.ui.componentCount,
                single: 'component',
                plural: 'components'
            });

            this.bindCollection({
                collection: this.model.relationships,
                element: this.ui.relationshipCount,
                single: 'relationship',
                plural: 'relationships'
            });

            var res = new resources.ResourceList({
                collection: this.model.resources
            });

            var comps = new components.ComponentList({
                collection: this.model.components
            });

            /*
            var rel = new relationships.RelationshipList({
                collection: this.model.relationships
            });
            */

            this.resources.show(res);
            this.components.show(comps);
            //this.relationships.show(rel);
        },

        bindCollection: function(options) {
            var handler = function(collection) {
                var text;

                if (collection.length === 1) {
                    text = '1 ' + options.single;
                } else {
                    text = collection.length + ' ' + options.plural;
                }

                options.element.text(text);
            };

            this.listenTo(options.collection, 'reset', handler);

            // Initialize
            handler(options.collection);
        }
    });


    return {
        SearchInput: SearchInput,
        SearchPage: SearchPage
    };

});
