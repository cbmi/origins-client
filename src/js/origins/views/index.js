/* global define */

define([
    'marionette',

    'tpl!templates/index.html'
], function(Marionette, template) {


    var IndexPage = Marionette.LayoutView.extend({

        template: template

    });

    return {
        IndexPage: IndexPage
    };

});
