/*
 * Pull down my sprint board and display it like jira does sort of
 * Only includes ready, in progress, finished and delivered by default
 * Include all users with -a flag otherwise it just includes your stories
 * Specify project with -p projectName or it will prompt you
 * */
var _ = require('underscore');
var _s = require('underscore.string');
var Promise = require('bluebird');
var settings = require('../data/settings');
var print = require('../core/print');
var colors = require('colors/safe');
var api = require('../core/api');

function getAndShowBoard(board, specificUserOnly) {
    api.getRapidBoardView(board.id).then(function(response) {
        var rapidBoard = response.data;
        //print.pretty(response.payload);
        var issuesFor = _.groupBy(rapidBoard.issuesData.issues, 'assignee');
        _.each(issuesFor, function(listOfIssues, assignee) {
            if ((!specificUserOnly || assignee === specificUserOnly) && listOfIssues.length > 0) {
                var name = _s.sprintf('%s (%s)', assignee, listOfIssues[0].assigneeName);
                print.success('\n==========================================');
                print.success(name);
                print.success('==========================================');
                /*
                * Map of column name to stories
                * */
                var storiesByColumn = _.groupBy(listOfIssues, function(issue) {
                    return _.find(rapidBoard.columnsData.columns, function(column) {
                        return column.statusIds.indexOf(issue.statusId) > -1;
                    }).name;
                });
                // loop over columns to preserve order, instead of storiesByColumn
                _.each(rapidBoard.columnsData.columns, function(column) {
                    var columnName = column.name;
                    var issues = storiesByColumn[columnName];
                    if (issues && issues.length) {
                        print.log('\n', colors.yellow(_s.sprintf('%s (%d)', columnName, issues.length)) , '\n');
                        var rows = [];
                        _.each(issues, function(issue) {
                            rows.push(
                                [
                                    issue.key,
                                    issue.type,
                                    colors.green(issue.summary)
                                ]);
                        });
                        print.table([ 'Key', 'Type', 'Summary' ], rows, {
                            thin: true,
                            colors: ['blue']
                        });
                        print.log('');
                    }
                });
            }
        });
    });
}

module.exports = function() {
    var args = _.toArray(arguments);
    var allUsers = args.indexOf('-a') > -1;
    var specifyProject = args.indexOf('-p');
    var project = specifyProject > -1 && (args.length > (specifyProject + 1)) ? args[specifyProject + 1] : null;
    var me = settings.gett.username;
    api.rapidViews().then(function(response) {
        var views = response.data;
        var suggested = project && _.find(views, function(v) {
            return _s.clean(v.name).toLowerCase() === _s.clean(project).toLowerCase();
        });
        if (suggested) {
            getAndShowBoard(suggested, allUsers ? null : me);
        } else {
            var whichBoard = print.question('list', 'board', 'Select which rapid board you would like to view');
            _.each(views, function(v) {
                whichBoard.choice(v.name);
            });
            print.ask(whichBoard).then(function(answer) {
                var board = _.find(views, function(v) {
                    return v.name === answer.board;
                });
                getAndShowBoard(board, allUsers ? null : me);
            });
        }
    }, function(error) {
        print.fail('Failed to gather rapid board options' + error ? error.message : '');
    });

};

module.exports.moduleDescription = 'Shows sprint boards that are available. If you know which board you want, use -p. To show all users, use -a.';
module.exports.moduleDescriptionExtra = 'Use -p BOARD to specify a board and not be prompted (case insensitive). Use -a to show all users.';
