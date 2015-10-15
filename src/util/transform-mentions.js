var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
module.exports = function(text) {
    try {
        var matches = text.match(/\B@[a-z0-9_-]+/gi);

        _.each(matches, function (match) {
            text = text.replace(match, _s.sprintf('[~%s]', match.substring(1)));
        });

        return text;
    } catch (e) {
        print.fail('Failed to transform mentions to jira syntax. ' + e ? e.message : '');
        return text;
    }
};