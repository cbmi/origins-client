/* global define */

define([
    'underscore',
    'jquery',
    'marionette',

    '../../utils',
    '../../app',

    'tpl!templates/link/form.html'
], function(_, $, Marionette, utils, app) {

    var templates = utils.templates(['form'], arguments, -1);

    var searchRegex = /(?:([+-])?(?:([^\s"']+|"[^"]+"|'[^']+')=)?([^\s"']+|"[^"]+"|'[^']+'))+/ig;

    var parseInputString = function(text) {
        var matches = [], match = searchRegex.exec(text);

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



    var EntitySearch = Marionette.View.extend({
        tagName: 'input',

        initialize: function() {
            _.bindAll(this, 'fetchItems', 'afterSelect');
        },

        render: function() {
            this.$el.typeahead({
                items: 'all',
                showHintOnFocus: true,
                delay: 200,
                source: this.fetchItems,
                matcher: function(item) { return item; },
                afterSelect: this.afterSelect
            });

            return this.el;
        },

        afterSelect: function() {
            var item = this.$el.val();
            this.itemId = this.itemMap[item];
            this.$el.val(this.itemId);
        },

        fetchItems: function(query, process) {
            this.query = query;

            var matches = parseInputString(query);

            if (this.xhr) this.xhr.abort();

            this.xhr = $.ajax({
                url: app.links.entities,
                data: $.param({
                    query: matches.map(function(m) { return m.value; }),
                    limit: 100
                }, true),
                success: function(results) {
                    this.processResults(results, process);
                }.bind(this)
            });
        },

        processResults: function(results, process) {
            this.itemMap = {};

            var items = results.map(function(data) {
                var html = [];

                if (data.path && data.path.length) {
                    html.push('<small>');

                    data.path.forEach(function(item, index) {
                        if (index > 0) {
                            html.push(" <i class='fa fa-angle-right'></i> ");
                        }
                        html.push(item.label);
                    });

                    html.push('</small><br>');
                }

                html.push('<span data-target=text>' + data.label + '</span>');
                html.push('<br>');
                html.push('<small>in ' + data.resource.label + '</small>');

                this.itemMap[data.label] = data.uuid;

                return {
                    html: html.join(''),
                    text: data.label
                };
            }, this);

            process(items);
        }
    });


    var Form = Marionette.ItemView.extend({
        tagName: 'form',

        className: 'form',

        template: templates.form,

        ui: {
            error: '[data-target=error]',
            label: '[name=label]',
            description: '[name=description]',
            type: '[name=type]',
            start: '[name=start]',
            end: '[name=end]',
            submit: '[name=submit]'
        },

        events: {
            'click @ui.submit': 'handleSave'
        },

        onRender: function() {
            this.ui.error.hide();

            this.startInput = new EntitySearch({
                el: this.ui.start[0]
            });

            this.endInput = new EntitySearch({
                el: this.ui.end[0]
            });

            this.startInput.render();
            this.endInput.render();
        },

        handleSave: function(event) {
            event.preventDefault();
            this.save();
        },

        clear: function() {
            this.ui.label.val('');
            this.ui.description.val('');
            this.ui.type.val('');
            this.ui.start.val('');
            this.ui.end.val('');
            this.startInput.itemId = null;
            this.endInput.itemId = null;
        },

        save: function() {
            this.ui.error.hide();

            var attrs = {
                label: this.ui.label.val() || null,
                description: this.ui.description.val() || null,
                type: this.ui.type.val() || null,
                start: this.startInput.itemId,
                end: this.endInput.itemId
            };

            var options = {
                wait: true,
                success: function() {
                    this.clear();
                }.bind(this),
                error: function(model, xhr) {
                    var message = xhr.responseJSON.message;
                    this.ui.error.html(message).show();
                }.bind(this)
            };

            this.collection.create(attrs, options);
        }
    });


    return {
        Form: Form
    };

});
