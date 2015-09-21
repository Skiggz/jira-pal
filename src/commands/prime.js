var print = require('../core/print');
module.exports = function() {
    print.info('I do not do anything yet!');
};

module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Populates local caches for various JIRA information for your JIRA setup.';
module.exports.moduleDescriptionExtra =
    'Many of jira-pals commands take arguments that are specific to your JIRA projects, like statues etc.. ' +
    'When referencing these in commands, the cache will populate by itself, but you can run it ahead of time ' +
    'to make future calls faster.';