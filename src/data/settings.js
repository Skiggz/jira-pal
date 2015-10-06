var fs = require('fs');
var _ = require('underscore');
var print = require('../core/print');

module.exports = {
    // the base url for your jira
    url: '',
    colors: true,
    credentialsFileLocation: __dirname + '/credentials.js',
    username: null,
    defaultCommand: 'help',
    defaultMeStatuses: ["In Progress"]
};

if (fs.existsSync(__dirname + '/settings-override.js')) {
    try {
        _.extendOwn(module.exports, require('./settings-override'));
    } catch (e) {
        print.fail(_s.sprintf('Failed to include settings overrides because %s', e && e.message));
    }
}