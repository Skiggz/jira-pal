var getIssues = require('./issues');
var Promise = require('bluebird');
var _ = require('underscore');
var print = require('../core/print');
var _s = require('underscore.string');

module.exports = function() {
    return new Promise(function(resolve, reject) {
        getIssues().then(function(issues) {
            var q = print.question('list', 'story', 'Select a story to copy the ID for');
            _.each(issues, function(issue) {
                q.choice(issue.key + ': ' + issue.summary());
            });
            print.ask(q).then(function(answers) {
                var answer = answers.story;
                resolve(_.find(issues, function(it) {
                    return _s.startsWith(answer, it.key);
                }));
            });
        }, function(e) {
            print.fail('Failed to fetch issues ' + e ? e.message : '');
        });
    });
};