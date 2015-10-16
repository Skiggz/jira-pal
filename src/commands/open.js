var _s = require('underscore.string');
var _ = require('underscore');
var settings = require('../data/settings');
var meKeyOrSearch = require('../util/me-key-or-search');
var open = require('open');

function openIssue(id) {
    open(_s.sprintf('https://%s/browse/%s', settings.gett.url, id));
}

module.exports = function() {
    meKeyOrSearch.apply(this, arguments)
        .then(
            openIssue,
            _.noop
        );
};

module.exports.moduleDescription = 'Open specific issue or search with -s and select';
module.exports.moduleDescriptionExtra = 'Example: jira open or jira open XXX-123 or jira open -s foobar';
