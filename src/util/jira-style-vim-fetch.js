/*
* A helper for opening vim with comments
* describing what to do, clearing them out
* and returning the text that you want
*
* Example:
*
* module.exports('Please enter some comments possibly containing jira mentions').then(...)
*
* or
*
* module.exports(['An array', 'Of lines to add with #']).then(...)
*
* The then function is passed the text result, with jira mentions added if applicable
* and all the comments removed from the sentence you passed in
* */
var _s = require('underscore.string');
var _ = require('underscore');
var Promise = require('bluebird');
var vim = require('./vim');
var transformMentions = require('../util/transform-mentions');

module.exports = function(details) {
    return new Promise(function(resolve) {
        var lines = [];
        if (typeof details === 'string') {
            lines.push(details);
        } else {
            lines = details;
        }
        var header = '\n';
        _.each(lines, function(line) {
            header += _s.sprintf('# %s \n', line);
        });
        header += '# These lines and everything below them will be discarded.\n';
        vim(header, true).then(function(result) {
            resolve(transformMentions(_s.trim(result.contents.replace(/#.*/g, ''))));
        });
    });
};