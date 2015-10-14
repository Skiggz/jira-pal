var fs = require('fs');
var settings = require('../data/settings');
module.exports = function() {
    /*
    * The API for jira is oauth or basic auth, for simplicity
    * (and avoiding implementing some narly terminal oauth)
    * we store the base64 user/pass combo in a file locally
    * This file is ignored by github so you don't accidentally
    * push your password anywhere.
    *
    * In the future, it would be nice to do something with oauth
    * but as a dev tool, it seems unnecessary. All communication
    * with jira is over HTTPS, and hopefully your jira password
    * isn't the same password you use for your bank. If you're
    * worried, change it, or implement a friendly terminal oauth
    * solution :)
    * */
    fs.writeFileSync(settings.directory + '/.jira-pal/credentials.js', 'module.exports = null;');
};

module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Removes base64 locally stored credentials';