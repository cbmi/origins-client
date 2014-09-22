/* global define */

define([
    'underscore',
    './views/base',
    './views/search',
    './views/pages',
    './views/resources',
    './views/collections',
    './views/components'
], function(_) {

    var mods = [].slice.call(arguments, 1);

    return _.extend.apply(null, [{}].concat(mods));

});
