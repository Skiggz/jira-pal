var BaseCache = require('../base-cache.js');
var JiraPriority = require('../../models/priority.js');

function JiraPriorityCache() {

    BaseCache.prototype.constructor.apply(this, ['priorities', 'priorities.js', 'priorities', JiraPriority]);

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