define([
    'react',
    'marked',
    '../app',
    '../time',
    './time-interval-mixin'
], function(React, marked, app, time, TimeIntervalMixin) {


    // Converts a string into a slug format.
    var slugify = function(text) {
        return text.replace(/\s+/, '-').toLowerCase();
    };


    var groupByLinkType = function(links) {
        var index = {},
            groups = [];

        links.forEach(function(link) {
            if (!index[link.type]) {
                index[link.type] = [];

                // Add group object and reference the index links array.
                groups.push({
                    type: link.type,
                    doc: link.doc,
                    links: index[link.type]
                });
            }

            index[link.type].push(link);
        });

        // Sorty by type
        groups.sort(function(n) {
            return n.type;
        });

        return groups;
    };


    var LinkRow = React.createClass({
        mixins: [TimeIntervalMixin],

        getDefaultProps: function() {
            return {
                attrs: {}
            };
        },

        render: function() {
            var attrs = this.props.attrs,
                source = attrs.start,
                target = attrs.end;

            var sourceHref = app.router.reverse('entity.index', source),
                targetHref = app.router.reverse('entity.index', target),
                sourceResourceHref = app.router.reverse('resource.index', source.resource),
                targetResourceHref = app.router.reverse('resource.index', target.resource);

            var ts = time.getInterval(attrs.parsedTime),
                timeSince = time.timeSince(ts);

            return (
                <tr>
                    <td>
                        <span className="data-type">{source.type}</span> <a href={sourceHref}>{source.label}</a>
                        <br />
                        <small className="meta">
                            <i className="fa fa-cubes" /> <a href={sourceResourceHref}>{source.resource.label}</a>
                        </small>
                    </td>
                    <td>
                        <span className="data-type">{target.type}</span> <a href={targetHref}>{target.label}</a>
                        <br />
                        <small className="meta">
                            <i className="fa fa-cubes" /> <a href={targetResourceHref}>{target.resource.label}</a>
                        </small>
                    </td>
                    <td>
                        <span className="timesince" title={attrs.parsedTime.toLocaleString()}>{timeSince}</span>
                    </td>
                </tr>
            );
        }
    });


    var LinkGroup = React.createClass({
        getDefaultProps: function() {
            return {
                type: '',
                doc: '',
                links: []
            };
        },

        render: function() {
            var slug = slugify(this.props.type);

            var rows = this.props.links.map(function(link) {
                return <LinkRow attrs={link} />;
            });

            var doc;

            if (this.props.doc) {
                doc = <p className="description">{this.props.doc}</p>;
            }

            return (
                <div id={slug} className="section">
                    <h4>{this.props.type}</h4>

                    {doc}

                    <table className="table table-condensed">
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            );
        }
    });


    // ResourceIndex renders links
    var Content = React.createClass({
        getDefaultProps: function() {
            return {
                groups: []
            };
        },

        render: function() {
            var groups = this.props.groups.map(function(group) {
                return <LinkGroup type={group.type} links={group.links} doc={group.doc} />;
            });

            return (
                <div>{groups}</div>
            );
        }
    });


    var TableOfContents = React.createClass({
        getDefaultProps: function() {
            return {
                title: '',
                types: []
            };
        },

        render: function() {
            var types = this.props.types.map(function(type) {
                var anchor = slugify(type);

                return (
                    <li>
                        <a href={ '#' + anchor }>{type}</a>
                    </li>
                );
            });

            return (
                <div className="toc">
                    <h3>{this.props.title}</h3>
                    <ul>{types}</ul>
                </div>
            );
        }
    });


    var TopologySummary = React.createClass({
        getDefaultProps: function() {
            return {
                title: 'Links',
                links: []
            };
        },

        render: function() {
            // Returns a sorted array of groups grouped by link type.
            var groups = groupByLinkType(this.props.links);

            var types = groups.map(function(n) {
                return n.type;
            });

            return (
                <div>
                    <TableOfContents title={this.props.title} types={types} />
                    <Content groups={groups} />
                </div>
            );
        }
    });


    return React.createFactory(TopologySummary);

});
