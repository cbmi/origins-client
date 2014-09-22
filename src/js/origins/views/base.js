/* global define */

define([
    'underscore',
    'backbone',
    'marionette',
], function(_, Backbone, Marionette) {

    var LoadingView = Marionette.ItemView.extend({
        template: 'loading',

        options: {
            message: 'Loading...'
        },

        serializeData: function() {
            return {
                message: this.options.message
            };
        }
    });

    var EmptyView = Marionette.ItemView.extend({
        template: 'empty',

        options: {
            message: 'Nothing to display'
        },

        serializeData: function() {
            return {
                message: this.options.message
            };
        }
    });

    var ErrorView = Marionette.ItemView.extend({
        template: 'error',

        serializeData: function() {
            return {
                header: this.options.header,
                message: this.options.message
            };
        }
    });


    var ErrorPage = Marionette.ItemView.extend({
        template: 'pages/error',

        serializeData: function() {
            return {
                header: this.options.header,
                message: this.options.message
            };
        }
    });


    var ObjectNotFound = ErrorView.extend({
        options: {
            header: 'Object not found'
        }
    });


    var NavigationError = ErrorView.extend({
        options: {
            header: 'Navigation error'
        }
    });


    var CollectionView = Marionette.CollectionView.extend({
        options: {
            loadingMessage: 'Loading...',
            emptyMessage: 'No data available',
            errorMessage: 'Error loading data'
        },

        getEmptyView: function() {
            if (this.collection) {
                if (this.collection.fetchError) {
                    return ErrorView;
                }
                else if (this.collection.fetching) {
                    return LoadingView;
                }
            }

            return EmptyView;
        },

        emptyViewOptions: function() {
            if (this.collection) {
                if (this.collection.fetchError) {
                    return {
                        message: this.options.errorMessage
                    };
                }
                else if (this.collection.fetching) {
                    return {
                        message: this.options.loadingMessage
                    };
                }
            }

            return {
                message: this.options.emptyMessage
            };
        }
    });


    return {
        LoadingView: LoadingView,
        EmptyView: EmptyView,
        ErrorView: ErrorView,
        ErrorPage: ErrorPage,
        ObjectNotFound: ObjectNotFound,
        NavigationError: NavigationError,
        CollectionView: CollectionView
    };

});
