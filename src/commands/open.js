var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var meQueryOrSearch = require('../util/me-query-or-search');
var settings = require('../data/settings');
var selectIssue = require('../util/select-issue');
var open = require('open');

function openIssue(id) {
    open(_s.sprintf('https://%s/browse/%s', settings.url, id));
}

module.exports = function() {
    var args = Array.prototype.slice.call(arguments),
        searchOrKey = args.shift();

    if(!searchOrKey || searchOrKey == '-s') {
        selectIssue(meQueryOrSearch.apply(this, _.toArray(arguments))).then(function(issue) {
            if (!issue) {
                print.info('No stories matched your search criteria');
                return;
            }
            openIssue(issue.key);
        }, function(e) {
            print.fail('Failed to fetch issues ' + e ? e.message : '');
        });
    } else {
        openIssue(searchOrKey);
    }
};

module.exports.moduleDescription = 'Open specific issue or search with -s and select';
module.exports.moduleDescriptionExtra = 'Example: jira open or jira open XXX-123 or jira open -s foobar';
