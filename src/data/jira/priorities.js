var BaseCache = require('../base-cache.js');

function JiraPriorityCache() {

    BaseCache.prototype.constructor.apply(this, ['priorities', 'priorities.js', 'priorities']);

    this.getHeader = function() {
        return [
            'ID', 'Name'
        ];
    };

    this.getRow = function(item) {
        return [
            item.id,
            item.name
        ];
    }

}

module.exports = new JiraPriorityCache();