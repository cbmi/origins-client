/* global define */

define([
    'underscore',
    'jquery',
    'marionette',

    '../../utils',
    '../../app',
    '../base',

    'tpl!templates/link/table.html',
    'tpl!templates/link/row.html'
], function(_, $, Marionette, utils, app, base) {

    var templates = utils.templates([
        'table',
        'row'
    ], arguments, -2);


    var Row = Marionette.ItemView.extend({
        tagName: 'tr',

        template: templates.row,

        behaviors: {
            TimeSince: {}
        },

        serializeData: function() {
            var attrs = this.model.toJSON();

            attrs.start.url = app.router.reverse('entity.index', attrs.start);
            attrs.end.url = app.router.reverse('entity.index', attrs.end);

            attrs.start.resource.url = app.router.reverse('resource.index', attrs.start.resource);
            attrs.end.resource.url = app.router.reverse('resource.index', attrs.end.resource);

            return attrs;
        }
    });


    var Table = base.CompositeView.extend({
        tagName: 'table',

        className: 'table table-condensed',

        template: templates.table,

        childView: Row,

        childViewContainer: 'tbody'
    });


    return {
        Table: Table
    };

});
