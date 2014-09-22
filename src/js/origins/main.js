/* global require */

require({
    config: {
        tpl: {
            variable: 'data'
        }
    },
    shim: {
        bootstrap: ['jquery']
    }
}, [
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'origins'
], function($, _, Backbone, Marionette, origins) {

    var app = new Marionette.LayoutView({
        el: 'body',

        regions: {
            main: '#main'
        }
    });

    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'collections(/)': 'collections',
            'collections/:uuid(/)': 'collection',
            'resources(/)': 'resources',
            'resources/:uuid(/)': 'resource',
            'components/:uuid(/)': 'component',
            'search(/)': 'search'
        },

        index: function() {
            var view = new origins.views.IndexPage();

            app.main.show(view);
        },

        search: function() {
            var view = new origins.views.SearchPage({
                model: origins.store.search
            });

            app.main.show(view);
        },

        collections: function() {
            var view = new origins.views.CollectionsPage({
                collection: origins.store.collections
            });

            app.main.show(view);
        },

        collection: function(uuid) {
            var view;

            if (!origins.store.collections.fetched) {
                if (!origins.store.collections.fetching) {
                    origins.store.collections.ensure();
                }

                this.listenToOnce(origins.store.collections, 'sync error', function() {
                    this.collection(uuid);
                });

                view = new origins.views.LoadingView({
                    message: 'Fetching collection ' + uuid
                });
            }
            else {
                var model = origins.store.collections.get(uuid);

                if (!model) {
                    view = new origins.views.ObjectNotFound({
                        message: 'Collection ' + uuid + ' not found :('
                    });
                } else {
                    model.resources.ensure();

                    view = new origins.views.CollectionPage({
                        model: model
                    });
                }
            }

            app.main.show(view);
        },

        resources: function() {
            var view = new origins.views.ResourcesPage({
                collection: origins.store.resources
            });

            origins.store.resources.ensure();

            app.main.show(view);
        },

        resource: function(uuid) {
            var view;

            if (!origins.store.resources.fetched) {
                if (!origins.store.resources.fetching) {
                    origins.store.resources.ensure();
                }

                this.listenToOnce(origins.store.resources, 'sync error', function() {
                    this.resource(uuid);
                });

                view = new origins.views.LoadingView({
                    message: 'Fetching resource ' + uuid
                });
            }
            else {
                var model = origins.store.resources.get(uuid);

                if (!model) {
                    view = new origins.views.ObjectNotFound({
                        message: 'Resource ' + uuid + ' not found :('
                    });
                } else {
                    model.components.ensure();

                    view = new origins.views.ResourcePage({
                        model: model
                    });
                }
            }

            app.main.show(view);
        },

        component: function(uuid) {
            var view, model = origins.store.components.get(uuid);

            if (model) {
                view = new origins.views.ComponentPage({
                    model: model
                });

                app.main.show(view);
                return;
            }

            // Cache not populated, get the model
            if (uuid) {
                model = new origins.models.Component({uuid: uuid});

                view = new origins.views.LoadingView({
                    message: 'Fetching component ' + uuid
                });

                var _this = this;

                model.fetch()
                    .done(function() {
                        origins.store.components.add(model);
                        _this.component(uuid);
                    })
                    .error(function() {
                        _this.error({
                            header: 'Component not found :(',
                            message: uuid
                        });
                    });

                return;
            }

            this.error({
                header: 'Component not found :(',
                message: uuid
            });
        },

        error: function(options) {
            var view;

            if (_.isPlainObject(options)) {
                view = new origins.views.ErrorPage(options);
            }
            else {
                view = options;
            }

            app.main.show(view);
        }

    });

    origins.ready(function() {

        var api = new origins.models.Api(null, {url: origins.config.get('api')}),
            router = new Router();

        api.fetch().then(function() {
            origins.urls = api.get('links');

            var options = origins.config.get('history');

            // Initialize global search element that can be bound to across
            // different contexts
            origins.search = new origins.views.SearchInput({
                el: '#search'
            });

            origins.search.on('search', function(query) {
                var url = 'search/?' + $.param({query: query});
                origins.store.search.search(query);

                var trigger = true;

                if (Backbone.history.getFragment().slice(0, 7) === 'search/') {
                    trigger = false;
                }

                Backbone.history.navigate(url, {trigger: trigger});
            });

            router.on('route:search', function() {
                var search  = document.location.search.slice(1),
                    params = origins.utils.deparam(search);

                origins.search.set(params.query);
            });

            if (!Backbone.history.start(options)) {
                router.navigate('/', {trigger: true});
            }

           // Route based on the URL
            $(document).on('click', 'a', function(event) {
                if (this.dataset.toggle) {
                    return;
                }

                // Path of the target link
                var path = this.pathname;

                // Handle IE quirk
                if (path.charAt(0) !== '/') path = '/' + path;

                // Trim off the root on the path if present
                var root = Backbone.history.root || '/';

                if (path.slice(0, root.length) === root) {
                    path = path.slice(root.length);
                }

                // If this is a valid route then go ahead and navigate to it,
                // otherwise let the event process normally to load the new
                // location.
                var cancel;

                try {
                    cancel = Backbone.history.navigate(path, {trigger: true});
                } catch (e) {
                    var view = origins.views.NavigationError({
                        message: 'There was a problem navigating to the ' +
                                 path + ' page.'
                    });

                    app.main.show(view);
                    cancel = true;
                }

                // Either a succesful match occurred or this is the same page
                if (cancel || cancel === undefined) {
                    event.preventDefault();
                }
            });
        }, function() {
            var view = new origins.views.ErrorPage({
                message: 'Communication error...'
            });

            app.main.show(view);
        });

    });

});
