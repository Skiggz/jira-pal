/*
* Runs all mocha tests by requiring the suites folder
* */
var fs = require('fs');
var _ = require('underscore');

_.each(fs.readdirSync(__dirname + '/suites'), function(filename) {
    // require everything in suites
    require('./suites/' + filename.replace(/\.js$/, ''));
});
