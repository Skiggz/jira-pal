var print = require('../core/print');
var getIssues = require('../util/issues');
var _ = require('underscore');
var _s = require('underscore.string');
var clipboard = require("copy-paste");

module.exports = function() {
    getIssues().then(function(issues) {
        var q = print.question('list', 'story', 'Select a story to copy the ID for');
        _.each(issues, function(issue) {
            q.choice(issue.key + ': ' + issue.summary());
        });
        print.ask(q).then(function(answers) {
            var answer = answers.story;
            var id = _.find(issues, function(it) {
                return _s.startsWith(answer, it.key);
            }).key;
            clipboard.copy(id, function() {
                print.info('Copied story ID ' + id + ' to your clipboard.');
            });
        });
    }, function(e) {
        print.fail('Failed to fetch issues ' + e ? e.message : '');
    });
};