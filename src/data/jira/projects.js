var BaseCache = require('../base-cache.js');

function JiraProjectsCache() {

    BaseCache.prototype.constructor.apply(this, ['projects', 'projects.js', 'projects']);

    this.getHeader = function() {
        return [
            'ID', 'Key', 'Name'
        ];
    };

    this.getRow = function(item) {
        return [
            item.id,
            item.key,
            item.name
        ];
    }

}

module.exports = new JiraProjectsCache();