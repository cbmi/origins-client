/* global define */

define([
    './base'
], function(base) {


    var Path = base.Model.extend({
        name: 'Path'
    });


    var Paths = base.Collection.extend({
        model: Path
    });


    return {
        Path: Path,
        Paths: Paths
    };

});
