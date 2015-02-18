define([
    'react',
    'marked',
    '../../app',
    '../../time',
    '../time-interval-mixin'
], function(React, marked, app, time, TimeIntervalMixin) {

    function pluralize(word) {
        if (/(ch|x|s)$/.test(word)) {
            return word + 'es';
        }

        return word + 's';
    }

    var SectionItem = React.createClass({
        mixins: [TimeIntervalMixin],

        getDefaultProps: function() {
            return {
                attrs: {},
                description: true
            };
        },

        render: function() {
            var attrs = this.props.attrs;

            var ts = time.getInterval(attrs.parsedTime),
                timeSince = time.timeSince(ts);

            var url = app.router.reverse('entity.index', attrs);

            var description;

            if (this.props.description) {
                description = <div className="section-description" dangerouslySetInnerHTML={{__html: marked(attrs.description || '')}} />;
            }

            return (
                <div className="section-attrs">
                    <span className="timesince" title={attrs.parsedTime.toLocaleString()}>{timeSince}</span>

                    <div className="section-label">
                        <a href={url}>{attrs.label}</a>
                    </div>

                    {description}
                </div>
            );
        }
    });


    var Section = React.createClass({
        getDefaultProps: function() {
            return {
                section: null,
                items: [],
                depth: 0,
                description: true
            };
        },

        render: function() {
            var type, types = [], description = this.props.description;

            var items = this.props.items.map(function(attrs) {
                type = pluralize(attrs.type);

                if (types.indexOf(type) == -1) {
                    types.push(type);
                }

                return <SectionItem attrs={attrs} description={description} />;
            });

            types = types.join(', ');

            var entityUrl = app.router.reverse('entity.index', this.props.section),
                sectionId = this.props.section.uuid,
                sectionDesc;

            if (description && this.props.section.description) {
                sectionDesc = <div dangerouslySetInnerHTML={{__html: marked(this.props.section.description)}} />;
            }

            return (
                <div id={sectionId} className="section">
                    <h3><a href={entityUrl}>{this.props.section.label}</a></h3>
                    {sectionDesc}
                    <h4>{types}</h4>
                    {items}
                </div>
            );
        }
    });


    // Renders a nested list of sections names with anchor links to
    // the summary table containing the entities.
    var TableOfContents = React.createClass({
        getDefaultProps: function() {
            return {
                title: '',
                tree: {}
            };
        },

        sectionItems: function(section) {
            var items = [],
                anchor,
                sublist;

            section.items.forEach(function(node) {
                // Do no include leaf nodes in the tree.
                if (node.items.length === 0) return;

                anchor = '#' + node.item.uuid;

                // Recurse for children.
                sublist = <ul>{this.sectionItems(node)}</ul>;

                items.push(<li><a href={anchor}>{node.item.label}</a>{sublist}</li>);
            }.bind(this));

            return items;
        },

        render: function() {
            var items = this.sectionItems(this.props.tree);

            return (
                <div className="toc">
                    <h3>{this.props.title}</h3>
                    <ul>{items}</ul>
                </div>
            );
        }
    });


    var Content = React.createClass({
        getDefaultProps: function() {
            return {
                sections: [],
                description: true
            };
        },

        render: function() {
            var description = this.props.description;

            var elements = this.props.sections.map(function(s) {
                return <Section section={s.section}
                                items={s.items}
                                depth={s.depth}
                                description={description} />;
            });

            return (
                <div>{elements}</div>
            );
        }
    });


    // The Summary component renders an index of entities contained in the
    // resource by type. Each type will consist of a section with a table of
    // entities containing the label, description last modified time, and
    // ancestors.
    //
    // Entities will be grouped into sets by type
    var EntitySummary = React.createClass({
        addToNode: function(item, node) {
            // Does not exist in the tree, add it
            if (node.index[item.id] === undefined) {

                // Add item as child node
                var idx = node.items.push({
                    item: item,
                    items: [],
                    index: {},
                    depth: node.depth + 1
                }) - 1;

                // Add the item id to the array index
                node.index[item.id] = idx
            }

            // Return node
            return node.items[node.index[item.id]];
        },

        buildTree: function(items) {
            // Index of items by their id.
            var tree = {
                items: [],
                index: {},
                depth: 0
            };

            var addToNode = this.addToNode;

            var depth, node, path;

            items.forEach(function(item) {
                node = tree;
                depth = item.path.length;
                path = item.path.slice(0).reverse();

                // Add all items in path to tree, each becoming the next
                // node in the path.
                path.forEach(function(i) {
                    node = addToNode(i, node);
                });

                // Add current item to the last node.
                addToNode(item, node);
            });

            return tree;
        },

        splitItems: function(node) {
            var sections = [],
                items = [];

            node.items.forEach(function(n) {
                if (n.items.length === 0) {
                    items.push(n.item);
                }
                else {
                    sections.push(n);
                }
            });

            return {
                sections: sections,
                items: items
            };
        },

        flattenTree: function(node, sections) {
            if (!sections) sections = [];

            // Sort the items based on the label.
            node.items.sort(function(item) {
                return item.label;
            });

            var split = this.splitItems(node);

            // Section item defined
            if (split.items.length) {
                sections.push({
                    section: node.item,
                    items: split.items,
                    depth: node.depth
                })
            }
            else if (split.sections.length) {
                sections.push({
                    section: node.item,
                    depth: node.depth
                });
            }
            for (var i = 0; i < split.sections.length; i++) {
                this.flattenTree(split.sections[i], sections);
            }

            return sections
        },

        // Flattens out the hierarchy for the section by inspecting the paths.
        // All items are assumed to be leafs until it appears in a path itself
        // then it gets promoted to a section.
        getSections: function(tree) {
            var sections = [];

            tree.items.forEach(function(node) {
                this.flattenTree(node, sections);
            }.bind(this));

            return sections;
        },

        getDefaultProps: function() {
            return {
                title: 'Entities',
                entities: [],
                description: true
            };
        },

        render: function() {
            var tree = this.buildTree(this.props.entities),
                sections = this.getSections(tree);

            return (
                <div>
                    <TableOfContents title={this.props.title} tree={tree} />
                    <Content sections={sections} description={this.props.description} />
                </div>
            );
        }
    });


    return React.createFactory(EntitySummary);

});
