/* global define */

define([
    'underscore',
    'marionette',
    'marked',

    'tpl!templates/entity/properties.html'
], function(_, Marionette, marked, template) {

    var parseValue = function(s) {
        if (typeof s === 'string') {
            return marked(_.escape(s));
        }

        return s;
    };

    var Table = Marionette.ItemView.extend({
        tagName: 'table',

        className: 'table table-condensed',

        template: template,

        serializeData: function() {
            var data = {};

            _.each(this.model.get('properties'), function(value, key) {
                if (_.isObject(value)) {
                    if (_.isArray(value)) {
                        data[key] = value.join(', ');
                    }
                    else {
                        data[key] = JSON.stringify(value, null, 4);
                    }
                }
                else {
                    data[key] = parseValue(value);
                }
            }, this);

            if (!_.isEmpty(data)) {
                return {
                    properties: data
                };
            }
        }
    });


    return {
        Table: Table
    };

});
