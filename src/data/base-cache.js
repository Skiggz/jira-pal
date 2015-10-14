/*
 * JIRA data is backed by local caches If the cache file doesn't exist, or
 * fails to load (json is not present or it is invalid) then we will
 * hit the API to update the local cache and always return the results
 * of the cache.
 * */
var _ = require('underscore');
var _s = require('underscore.string');
var cache = require('../core/cache');
var api = require('../core/api');
var print = require('../core/print');
var Promise = require('bluebird');

/*
* Creates a basic base cache. This should be extended
* in your cache class. Make sure to override getHeader
* and getRow for listing functionality.
* */
function BaseCache(cacheIdentifier, filename, apiMethodName) {

    var self = this;
    this.id = cacheIdentifier;
    this.filename = filename;
    this.apiMethodName = apiMethodName;

    cache.add(self.id, self.filename);

    this.getHeader = function() {
        throw new Error('Implement me. I should return a list of header fields for display');
    };

    this.getRow = function(item) {
       throw new Error('Implement me. I should return an array of fields');
    };

    this.list = function() {
        return new Promise(function(resolve, reject) {
            var json = cache.gett(self.id);
            if (!json) {
                api[self.apiMethodName]().then(function(response) {
                    var items = response.data;
                    cache.sett(self.id, JSON.stringify(items));
                    resolve(items);
                }, function(e) {
                    print.fail(_s.sprintf('Failed to fetch jira cache items for "%s". %s', self.id, e ? e.message : '?'));
                    reject(e);
                });
            } else {
                resolve(json);
            }
        });
    };

    this.display = function() {
        self.list().then(function(items) {
            var rows = [];
            _.each(items, function(item) {
                rows.push(self.getRow(item));
            });
            print.table(self.getHeader(), rows, {
                thin: true,
                colors: ['blue']
            });
        }, function(e) {
            print.fail(_s.sprintf('Failed to get items from list method for %s. %s', self.id, e ? e.message : ''));
        });
    };

};


module.exports = BaseCache;