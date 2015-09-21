var print = require('../core/print');
module.exports = function() {
    print.info('I do not do anything yet!');
};

module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Clears local caches that include various JIRA information for your JIRA setup.';
module.exports.moduleDescriptionExtra =
    'If you are getting errors that some things are not found, try clearing and re priming your JIRA cache. ' +
    'This goes for statuses, types, custom fields etc... Every case is unique, but can be affected by outdated caches';