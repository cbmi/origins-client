/* global define */

define([
    './base'
], function(base) {


    var Agent = base.Model.extend({
        name: 'Agent'
    });


    var Agents = base.Collection.extend({
        model: Agent
    });


    return {
        Agent: Agent,
        Agents: Agents
    };

});
