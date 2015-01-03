/* global define */

define(function() {

    // The Store stores model instances by their ID. It prevents having
    // copies of instances which leads to state inconsistencies. Regardless
    // if a new instance is initialized via `new Model` or it is fetched
    // by a collection, only one instance will ever exist for an model/ID
    // combination.
    var Store = function() {
        this.index = {};
    };


    // Add an instance to the store
    Store.prototype.add = function(instance) {
        var name = instance.constructor.prototype.name;

        if (!name) {
            throw new Error('model does not have a name');
        }

        if (instance.id === undefined) {
            throw new Error('cannot store instance without id');
        }

        var items = this.index[name];

        // If the instance already exists, this is considered a bug
        if (items) {
            var item = items[instance.id];

            if (item && item !== instance) {
                throw new Error(name + '(' + instance.id + ') already exists');
            }
        }
        else {
            items = this.index[name] = {};
        }

        this.index[name][instance.id] = instance;
    };


    // Remove instance from the store
    Store.prototype.remove = function(instance) {
        var name = instance.constructor.prototype.name;

        if (!name) {
            throw new Error('model does not have a name');
        }

        if (instance.id === undefined) {
            throw new Error('cannot remove instance without id');
        }

        var items = this.index[name];

        // Remove instance from store
        if (items) {
            if (items[instance.id]) {
                delete items[instance.id];
                return true;
            }
        }

        return false;
    };


    // Attempts to get a model instance by Id
    Store.prototype.get = function(model, attrs) {
        if (!attrs) return;

        var items, name, id;

        // Instance, get the model
        if (!model.prototype) {
            model = model.constructor;
        }

        name = model.prototype.name;

        if (!name) {
            throw new Error('model does not have a name');
        }

        // Extract the id from the attributes, otherwise assume
        // attrs is the id.
        if (typeof attrs === 'object') {
            id = attrs[model.prototype.idAttribute];
            if (id === undefined) return;
        }
        else {
            id = attrs;
        }

        items = this.index[name];

        if (items) return items[id];
    };


    // Initialize and return a store singleton
    return new Store();

});
