var Promise = require('bluebird');
var _ = require('underscore');
var print = require('../core/print');
var meQueryOrSearch = require('../util/me-query-or-search');
var selectIssue = require('../util/select-issue');

module.exports = function() {
    var args = Array.prototype.slice.call(arguments),
        searchOrKey = args.shift();

    return new Promise(function(resolve, reject) {
        if(!searchOrKey || searchOrKey == '-s') {
            selectIssue(meQueryOrSearch.apply(this, args)).then(function(issue) {
                if (!issue) {
                    print.info('No stories matched your search criteria');
                    return reject();
                }
                resolve(issue.key);
            }, function(e) {
                print.fail('Failed to fetch issues ' + e ? e.message : '');
                reject();
            });
        } else {
            resolve(searchOrKey);
        }
    });
};
