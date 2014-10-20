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
                message: this.getOption('message')
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
                message: this.getOption('message')
            };
        }
    });

    var ErrorView = Marionette.ItemView.extend({
        template: 'error',

        serializeData: function() {
            return {
                header: this.getOption('header'),
                message: this.getOption('message')
            };
        }
    });


    var ErrorPage = Marionette.ItemView.extend({
        template: 'pages/error',

        serializeData: function() {
            return {
                header: this.getOption('header'),
                message: this.getOption('message')
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
                        message: this.getOption('errorMessage')
                    };
                }
                else if (this.collection.fetching) {
                    return {
                        message: this.getOption('loadingMessage')
                    };
                }
            }

            return {
                message: this.getOption('emptyMessage')
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
