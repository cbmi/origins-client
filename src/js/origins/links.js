/* global define */

define([
    'url-template',
], function(url) {

    // compile regular expressions ahead of time for efficiency
    var relsRegExp = /\brel="?([^"]+)"?\s*;?/,
        keysRegExp = /(\b[0-9a-z\.-_]+\b)/g,
        sourceRegExp = /^<(.*)>/;

    var parseString = function(string, template) {
        if (!string) return;

        var links = {},
            entries = string.split(',');

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i].trim();
            var rels = relsRegExp.exec(entry);

            if (rels) {
                var keys = rels[1].match(keysRegExp);
                var source = sourceRegExp.exec(entry)[1];

                for (var k = 0; k < keys.length; k++) {
                    links[keys[k]] = template ? url.parse(source) : source;
                }
            }
        }

        return links;
    };


    var parse = function(xhr) {
        var link = xhr.getResponseHeader('Link'),
            linkTemplate = xhr.getResponseHeader('Link-Template');

        return {
            links: parseString(link),
            linkTemplates: parseString(linkTemplate, true)
        };
    };


    return {
        parse: parse
    };

});
