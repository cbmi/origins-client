/* global define */
define([
    'underscore',
    'marionette'
], function(_, Marionette) {

    var intervals = [
        [60 * 60 * 24 * 365, 'year', 'years'],
        [60 * 60 * 24 * 30, 'month', 'months'],
        [60 * 60 * 24 * 7, 'week', 'weeks'],
        [60 * 60 * 24, 'day', 'days'],
        [60 * 60, 'hour', 'hours'],
        [60, 'minute', 'minute'],
        [1, 'second', 'seconds']
    ];


    var timeSince = function(remainder, interval) {
        if (interval[1] === 'second' && remainder < 3) {
            return 'Just now';
        }

        var unit = remainder === 1 ? interval[1] : interval[2];
        return remainder + ' ' + unit + ' ago';
    };

    var getInterval = function(date) {
        var seconds = Math.max(Math.floor((new Date() - date) / 1000), 1);

        for (var v, r, i = 0; i < intervals.length; i++) {
            r = intervals[i];
            v = Math.floor(seconds / r[0]);

            if (v >= 1) {
                return [v, r];
            }
        }

        throw new Error('time interval error');
    };


    var TimeSince = Marionette.Behavior.extend({
        defaults: {
            selector: '[data-target=timesince]'
        },

        ui: function() {
            return {
                time: this.getOption('selector')
            };
        },

        initialize: function() {
            _.bindAll(this, 'renderTime');
        },

        onShow: function() {
            this.renderTime();

            // Render the actual date/time in the title
            var time = this.view.model.get('parsedTime');
            this.ui.time.attr('title', time.toLocaleString());
        },

        onDestroy: function() {
            clearTimeout(this.interval);
        },

        renderTime: function() {
            var time = this.view.model.get('parsedTime');
            // Determine interval of time for update
            var out = getInterval(time);
            this.ui.time.text(timeSince(out[0], out[1]));

            // Reset interval depending on the current unit of time.
            // For example, if the time is below one hour, the interval
            // if every minute.
            if (this.updateInterval !== out[1][0]) {
                clearTimeout(this.interval);
                this.updateInterval = out[1][0];
                // Intervals take milliseconds
                this.interval = setInterval(this.renderTime, this.updateInterval * 1000);
            }
        }
    });


    var behaviors = {
        TimeSince: TimeSince
    };


    Marionette.Behaviors.behaviorsLookup = function() {
        return behaviors;
    };

});
