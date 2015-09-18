var fs = require('fs');
var _ = require('underscore');
var print = require('../core/print');

module.exports = {
    colors: true
};

if (fs.existsSync(__dirname + '/settings-override.js')) {
    try {
        _.extendOwn(module.exports, require('./settings-override'));
    } catch (e) {
        print.fail(_s.sprintf('Failed to include settings overrides because %s', e && e.message));
    }
}