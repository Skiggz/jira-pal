/*
* JIRA data is backed by local caches If the cache file doesn't exist, or
* fails to load (json is not present or it is invalid) then we will
* hit the API to update the local cache and always return the results
* of the cache.
* */
var _ = require('underscore');
var cache = require('../../core/cache');
var api = require('../../core/api');
var print = require('../../core/print');
var Promise = require('bluebird');
var JiraStatus = require('../../models/status.js');

var CACHE_ID = 'statuses';

cache.add(CACHE_ID, 'statuses.js');

function JiraStatusRepo() {

    var self = this;

    this.list = function() {
        return new Promise(function(resolve, reject) {
            var json = cache.gett(CACHE_ID);
            if (!json) {
                api.statuses().then(function(response) {
                    var items = _.map(JSON.parse(response.payload), function(s) {
                        return new JiraStatus(s);
                    });
                    cache.sett(CACHE_ID, JSON.stringify(items));
                    resolve(items);
                }, function(e) {
                    print.fail('Failed to fetch jira statuses. ' + e ? e.message : '');
                    reject(e);
                });
            } else {
                resolve(json);
            }
        });
    };

    this.display = function() {
        self.list().then(function(statuses) {
            var rows = [];
            _.each(statuses, function(status) {
                rows.push(
                    [
                        status.name,
                        status.description
                    ]);
            });
            print.table([ 'Name', 'Description' ], rows, {
                thin: true,
                colors: ['blue']
            });
        }, function(e) {
            print.fail('Failed to get statuses from list method' + e ? e.message : '');
        });
    };

};


module.exports = new JiraStatusRepo();