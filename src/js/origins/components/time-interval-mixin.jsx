define([
    '../time'
], function(time) {

    var TimeIntervalMixin = {
        // The only state this component has is the self-updating "time since"
        // text. This will be updated periodically based on the calculated
        // time interval.
        getInitialState: function() {
            return {
                time: null
            };
        },

        componentWillMount: function() {
            this.timeSinceId = null;
            this.timeSinceInterval = 0;
        },

        componentDidMount: function() {
            this.setTimeSinceInterval();
        },

        componentWillUnmount: function() {
            clearTimeout(this.timeSinceId);
        },

        setTimeSinceInterval: function() {
            var ts = time.getInterval(this.props.attrs.parsedTime);

            // Reset interval depending on the current unit of time.
            // For example, if the time is below one hour, the interval
            // if every minute.
            if (this.timeSinceInterval !== ts.interval) {
                clearTimeout(this.timeSinceId);

                // Minimum interval is 60 seconds.
                this.timeSinceInterval = Math.max(ts.interval, 60);

                // Convert interval to milliseconds.
                this.timeSinceId = setInterval(this.renderTime,
                                               this.timeSinceInterval * 1000);
            }
        },

        // Since the time is a relative calculation against a value in props
        // we simply increment a counter to React always triggers a render.
        renderTime: function() {
            this.setState({
                timeSince: this.state.timeSince++
            });
        }
    };

    return TimeIntervalMixin;

});
