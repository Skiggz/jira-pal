var settings = require('../data/settings');
var question = require('inquirer');
var _ = require('underscore');
var colors = require('colors/safe');
// cliff tables are smaller and easier to display heavier data sets
var cliff = require('cliff');
// bigger tables
var Table = require('cli-table');
/*
* Controls the stdout and user interface
* Respects various settings configs
* */
function print(color, words) {
    if (settings.gett.colors) {
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

    this.checkbox = function(name, checked, disabled) {
        var option = {
            name: name
        };
        if (checked !== void(0)) {
            option.checked = checked;
        }
        if (disabled) {
            option.disabled = disabled;
        }
        self.choices.push(option);
        return self;
    };

    this.separator = function() {
        self.choices.push(new question.Separator());
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
    var questions = _.filter(_.toArray(arguments), function(q) {
        return (q.type !== 'list' && q.type !== 'checkbox') || q.choices.length > 0;
    });
    return {
        then: function(callback) {
            question.prompt(questions, callback);
        }
    }
};

/*
* Big and small table outputs via options
* */
module.exports.table = function(header, rows, options) {
    if (options.thin) {
        var thinRows = [header];
        _.each(rows, function(row) {
            thinRows.push(row);
        });
        module.exports.log(cliff.stringifyRows(thinRows, options.colors));
    } else {
        var tableOptions = {
            head: header
        };
        if (options.widths) {
            tableOptions.colWidths = options.widths;
        }
        var table = new Table(tableOptions);
        _.each(rows, function(row) {
            table.push(row);
        });
        module.exports.log(table.toString());
    }
};