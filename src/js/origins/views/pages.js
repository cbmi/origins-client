/* global define */

define([
    'underscore',
    'backbone',
    'marionette'
], function(_, Backbone, Marionette) {


    var IndexPage = Marionette.ItemView.extend({
        template: 'pages/index',

        className: 'index'
    });


    return {
        IndexPage: IndexPage
    };

});
