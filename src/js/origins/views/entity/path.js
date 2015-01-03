/* global define */

define([
    'marionette',

    '../../utils',
    '../../app',

    'tpl!templates/entity/path-item.html',
], function(Marionette, utils, app) {

    var templates = utils.templates([
        'item',
    ], arguments, -1);


    var Item = Marionette.ItemView.extend({
        template: templates.item,

        serializeData: function() {
            var attrs = this.model.toJSON();

            attrs.url = app.router.reverse('entity.index', attrs);

            return attrs;
        }
    });


    var Path = Marionette.CollectionView.extend({
        className: 'path',

        childView: Item
    });


    return {
        Path: Path
    };

});
