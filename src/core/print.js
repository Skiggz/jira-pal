var settings = require('../data/settings');
var question = require('inquirer');
var _ = require('underscore');
var colors = require('colors/safe');
/*
* Controls the stdout and user interface
* Respects various settings configs
* */
function print(color, words) {
    if (settings.colors) {
        console.log(colors[color](words));
    } else {
        console.log(words);
    }
}

module.exports.success = function(words) {
    // color good
    print('green', words);
};

module.exports.fail = function(words) {
    // color bad
    print('red', words);
};

module.exports.info = function(words) {
    // color cyan
    print('magenta', words);
};

module.exports.log = function() {
    // console.log
    console.log.apply(console, _.toArray(arguments));
};

module.exports.prompt = function() {
    // inquirer usage
};