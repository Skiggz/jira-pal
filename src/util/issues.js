var api = require('../core/api');
var settings = require('../data/settings');
var JiraIssue = require('../models/issue');
var Promise = require('bluebird');
var _ = require('underscore');

module.exports = function(args) {
    var args = args || { length: 0 };
    return new Promise(function(resolve, reject) {
        var query = api.queryBuilder().search;
        if (args.length === 0) {
            query.fields.assignee().equals(settings.username);
            if (settings.defaultMeStatuses) {
                query.and().fields.status().in(settings.defaultMeStatuses);
            }
        } else {
            var search = '';
            for (var i = 0; i < args.length; i++) {
                search += ' ' + args[i];
            }
            query.raw(search);
        }
        api.search(query).then(function(response) {
            var issues = [];
            _.each(JSON.parse(response.payload).issues, function (issueJson) {
                issues.push(new JiraIssue(issueJson));
            });
            resolve(issues);
        }, reject);
    });
};