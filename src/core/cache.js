/*
* All jira data files use a cache module at its core, to either access a cached json data
* file, or hit the web for updated information.
*
* THis is mainly because pretty much every JIRA project has custom fields, statuses etc..
* that can change from project to project and jira application to application and so on.
* */
var _ = require('underscore');
var fs = require('fs');
var print = require('./print');

function CacheItem(id, filename) {

    this.name = id;
    this.filename = filename;

}

function JiraCache() {

    var self = this;
    this.caches = {};

    /*
     * The cache is a generic store that provides some organization to caching
     * Actual caches should be implemented outside of here and just reference
     * the cache. For example, statuses.js is a list of jira status available
     * The statuses module serves up statues to consumers, and gets those
     * statuses either from the cache, or api. If it gets them from the api
     * it should then update the cache. This way concerns are easily separated
     * for various caches and we don't have to store urls and different api
     * calls etc.. to the cache itself. Then all the things that want statuses
     * for instance, just reference statuses.js and it uses the cache behind the
     * scenes. Then globally, the cache can be cleared, partially or fully, and
     * it never has to know a thing about where the data comes from.
     *
     * So this method will actually store json to a file from the consumer.
     * The id param should match the cache item it references
     * */
    this.sett = function(id, jsonString) {
        if (!self.caches[id].filename) {
            print.fail('Cache not found for id: ' + id);
        } else {
            fs.writeFileSync(self.caches[id].filename, jsonString);
        }
    };

    this.clear = function() {
        // delete all cache files
        _.each(self.caches, function(cacheItem, id) {
            // delete file by filename
            if (fs.existsSync(cacheItem.filename)) {
                fs.unlinkSync(cacheItem.filename);
            }
        });
        print.info('Removed all cache files.');
    };

    /*
    * Filename should be relative to the cache directory
    * */
    this.add = function(id, filename) {
        self.caches[id] = new CacheItem(id, __dirname + '/../cache/' + filename);
    };

    /*
    * Get cache value (json) for given id
    * */
    this.gett = function(id) {
        var item = self.caches[id];
        if (!item.filename) {
            print.fail('Cache not found for id: ' + id);
            return null;
        } else {
            if (fs.existsSync(item.filename)) {
                return JSON.parse(fs.readFileSync(item.filename));
            } else {
                return null;
            }
        }
    };

}

module.exports = new JiraCache();