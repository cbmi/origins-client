/* global define */

define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',

    '../app',
    '../links',
    '../deparam',
    './entity',

    'tpl!templates/search.html',
], function($, _, Backbone, Marionette, app, links, deparam, entity, template) {


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

    var searchRegex = /(?:([+-])?(?:([^\s"']+|"[^"]+"|'[^']+')=)?([^\s"']+|"[^"]+"|'[^']+'))+/ig;  // jshint ignore:line

    var parseInputString = function(text) {
        var matches = [],
            match = searchRegex.exec(text);

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

    var SearchInput = Marionette.View.extend({
        tagName: 'input',

        className: 'form-control',

        attributes: {
            type: 'search',
            autocomplete: 'off',
            placeholder: 'Search...'
        },

        events: {
            'input': '_handleInput',
            'keypress': 'submit'
        },

        initialize: function() {
            this._handleInput = _.debounce(this.handleInput, 400);
        },

        handleInput: function() {
            var value = $.trim(this.el.value);

            if (value) {
                this.trigger('search', value);
            }
        },

        submit: function(event) {
            if (event.which === 13) {
                this.handleInput();
            }
        },

        onShow: function() {
            // Focus the input
            if (this.getOption('focus')) {
                _.defer(function() {
                    this.$el.focus();
                }.bind(this));
            }
        },

        set: function(value) {
            if (this.el.value !== value) {
                this.el.value = value;
                this.trigger('search', value);
            }
        }
    });


    // Results are just entities
    var Results = entity.List.extend({
        className: 'listing',

        options: {
            emptyMessage: ''
        }
    });


    var SearchPage = Marionette.LayoutView.extend({
        template: template,

        ui: {
            loader: '[data-target=loader]'
        },

        regions: {
            search: '[data-region=search]',
            results: '[data-region=results]'
        },

        options: {
            scrollBuffer: 300
        },

        initialize: function() {
            _.bindAll(this,
                      'onScroll',
                      'onFetchSuccess',
                      'onFetchComplete',
                      'onFetchError');

            // Prevent scroll flickering
            this._onScroll = _.debounce(this.onScroll, 100);
        },

        // Handles the window scroll event to trigger new results to be fetched
        // dynamically for the current search.
        onScroll: function(event) {
            event.preventDefault();

            // If something is already loading or no query is present, ignore
            if (this.loading || !this.query) return;

            var position = $(window).scrollTop(),
                threshold = $(document).height() - $(window).height() -
                            this.getOption('scrollBuffer');

            if (position >= threshold) {
                this.fetchNextPage();
            }
        },

        onShow: function() {
            this.ui.loader.hide();

            // Bind window for scrolling pagination.
            $(window).on('scroll', this.onScroll);

            var search = new SearchInput({focus: true});

            // The 'search' event is triggered by the input which will cause
            // the search results to be reset.
            this.listenTo(search, 'search', this.onSearch);

            var results = new Results({
                collection: this.collection
            });

            this.getRegion('search').show(search);
            this.getRegion('results').show(results);

            // Get current query parameter to pre-load search results
            var query = document.location.search.slice(1),
                params = deparam.parse(query);

            // Set the search input to the current query
            if (params.query) {
                search.set(params.query);
            }
        },

        onBeforeDestroy: function() {
            if (this.xhr) this.xhr.abort();

            $(window).off('scroll', this.onScroll);
        },

        onSearch: function(query) {
            if (this.query === query) return;
            if (this.xhr) this.xhr.abort();

            this.query = query;
            this.pageLinks = null;
            this.collection.reset();

            var url = app.router.reverse('search');

            if (this.query) {
                url = url + '?' + $.param({query: query});
                this.fetchFirstPage();
            }

            Backbone.history.navigate(url);
        },

        fetchNextPage: function() {
            if (!this.pageLinks.next) return;

            this.reset = false;

            this.sendRequest({
                url: this.pageLinks.next,
                success: this.onFetchSuccess,
                error: this.onFetchError,
                complete: this.onFetchComplete
            });
        },

        fetchFirstPage: function() {
            this.reset = true;

            var matches = parseInputString(this.query);

            var data = $.param({
                query: matches.map(function(m) {
                    return m.value;
                }),
            }, true);

            this.sendRequest({
                url: _.result(this.collection, 'url'),
                data: data,
                success: this.onFetchSuccess,
                error: this.onFetchError,
                complete: this.onFetchComplete
            });
        },

        sendRequest: function(options) {
            this.loading = true;
            this.ui.loader.show();

            this.xhr = $.ajax(options);
        },

        onFetchSuccess: function(resp, status, xhr) {
            this.pageLinks = links.parse(xhr).links;

            if (this.reset) {
                this.collection.reset(resp, {parse: true});
            }
            else {
                this.collection.add(resp, {parse: true});
            }
        },

        onFetchError: function() {

        },

        onFetchComplete: function() {
            this.loading = false;
            this.ui.loader.hide();
        }
    });


    return {
        SearchInput: SearchInput,
        SearchPage: SearchPage
    };

});
