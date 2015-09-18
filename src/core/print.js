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

function Question(type, answerKey, message) {

    var self = this;
    this.type = type;
    this.name = answerKey;
    this.message = message;
    this.choices = [];
    this.validate = function(input) {
        return true;
    };

    this.choice = function(val) {
        self.choices.push(val);
        return self;
    };

    this.validIf = function(fn) {
        self.validate = fn;
        return self;
    };

    this.defaultTo = function(value) {
        self.default = value;
        return self;
    };
}

/*
* Wrapper for inquirer for slightly saner visual code
*
* usage:
*
* var print = require(<<this module>>);
*
* print.ask(
*     print.question('list', 'favoriteColor', 'What is your fav color?')
*        .choice('blue')
*        .choice('green'),
*     print.question('confirm', 'sleepy', 'Are you sleepy?')
* ).then(function(answers) {
*     print.log('Your favorite color is ', answers.favoriteColor);
*     print.log('You look very ', answers.sleepy ? 'sleepy' : 'awake');
* })
*
*
* */
module.exports.question = function(type, answerKey, message) {
    return new Question(type, answerKey, message);
};

module.exports.ask = function(/* question args */) {
    var questions = _.toArray(arguments);
    return {
        then: function(callback) {
            question.prompt(questions, callback);
        }
    }
};