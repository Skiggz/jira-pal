var api = require('../core/api');
var settings = require('../data/settings');
var JiraIssue = require('../models/issue');
var Promise = require('bluebird');
var _ = require('underscore');

/*
* Turn arguments into jql statement and return search results
* */
module.exports = function(query) {
    return new Promise(function(resolve, reject) {
        api.search(query).then(function(response) {
            var issues = [];
            _.each(JSON.parse(response.payload).issues, function (issueJson) {
                issues.push(new JiraIssue(issueJson));
            });
            resolve(issues);
        }, reject);
    });
};