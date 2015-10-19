var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var meKeyOrSearch = require('../util/me-key-or-search');
var api = require('../core/api');
var vim = require('../util/jira-style-vim-fetch');

function unwatch(issueKey) {
    api.unwatch(issueKey)
        .then(
            function() {
                print.success('You are no longer watching ' + issueKey);
            },
            function(e) {
                print.fail('There was a problem trying to unwatch ' + e ? e.message : '');
            }
        );
}

module.exports = function() {
    meKeyOrSearch.apply(this, arguments)
        .then(
            unwatch,
            _.noop
        );
};

module.exports.moduleDescription = 'Stop watching a specific issue or search with -s and select';
module.exports.moduleDescriptionExtra = 'Example: jira unwatch or jira unwatch XXX-123 or jira unwatch -s foobar';
