/* global define */

define([
    'underscore',
    'backbone',
    'marionette',

    'tpl!templates/message.html'
], function(_, Backbone, Marionette, template) {


    var MessageView = Marionette.ItemView.extend({
        template: template,

        className: 'message',

        serializeData: function() {
            return {
                header: this.getOption('header'),
                message: this.getOption('message')
            };
        },

        onRender: function() {
            this.$el.addClass(this.getOption('stateClass'));
        }
    });


    var CollectionView = Marionette.CollectionView.extend({
        options: {
            loadingHeader: '',
            loadingMessage: '<i class="fa fa-circle-o-notch fa-spin"></i>',
            emptyHeader: 'No data available.',
            emptyMessage: ''
        },

        emptyView: MessageView,

        emptyViewOptions: function() {
            if (this.collection.fetching) {
                return {
                    stateClass: 'is-loading',
                    header: this.getOption('loadingHeader'),
                    message: this.getOption('loadingMessage')
                };
            }

            return {
                stateClass: 'is-empty',
                header: this.getOption('emptyHeader'),
                message: this.getOption('emptyMessage')
            };
        }
    });


    var CompositeView = Marionette.CompositeView.extend();

    CompositeView.prototype.options = CollectionView.prototype.options;
    CompositeView.prototype.getEmptyView = CollectionView.prototype.getEmptyView;
    CompositeView.prototype.emptyViewOptions = CollectionView.prototype.emptyViewOptions;


    return {
        MessageView: MessageView,
        CollectionView: CollectionView,
        CompositeView: CompositeView
    };

});
