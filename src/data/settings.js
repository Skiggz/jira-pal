var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');

var settings = {
    // the base url for your jira
    url: '',
    colors: true,
    username: null,
    defaultCommand: 'help',
    defaultMeStatuses: ["In Progress"],
    directory: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
};

/*
 * Make sure our jira-pal directory exists, if not, create it
 * */
try {
    fs.mkdirSync(settings.directory + '/.jira-pal');
} catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
}

/*
* Now lookup setting overrides and apply them if they exist (if user entered a custom location then
* we shouldn't find a settings override file yet)
* */

var overrides = settings.directory + '/.jira-pal/settings-override.js';
if (fs.existsSync(overrides)) {
    try {
        _.extendOwn(settings, JSON.parse(fs.readFileSync(overrides)));
    } catch (e) {
        console.error(_s.sprintf('Failed to include settings overrides because %s', e && e.message));
    }
}

module.exports = settings;