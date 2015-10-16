/*
* Jira Transitions, aliased as "jira flow" for typeability
* */
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var selectIssue = require('../util/select-issue');
var vim = require('../util/vim');
var clipboard = require("copy-paste-no-exec");
var meQueryOrSearch = require('../util/me-query-or-search');
var api = require('../core/api');
var transformMentions = require('../util/transform-mentions');

function getJiraTransitionBody(transitionId, comments) {
    var obj = {
        transition: {
            id: transitionId
        }
    };
    if (comments) {
        obj.update = {
            comment: [
                {
                    add: {
                        body: comments
                    }
                }
            ]
        }
    }
    return obj;
}

function complete(issue, transition, comments) {
    print.ask(
        print.question('confirm', 'post', _s.sprintf('%s %s %s?' ,transition.name, issue.key, comments ? 'with the above comments' : ''))
    ).then(function(confirmation) {
            if (confirmation.post) {
                api.transition(issue.key, getJiraTransitionBody(transition.id, comments)).then(function(response) {
                    print.success(_s.sprintf('%s %s successful' ,transition.name, issue.key));
                }, function(e) {
                    print.fail('Failed to transition issue. ' + e ? e.message : '');
                });
            } else {
                print.fail('Story transition cancelled.');
            }
        });
}

module.exports = function() {
    selectIssue(meQueryOrSearch.apply(this, _.toArray(arguments))).then(function(issue) {
        if (!issue) {
            print.info('No stories matched your search criteria');
            return;
        }
        api.getTransitions(issue.key).then(function(response) {
            var transitions = response.data;
            var whichTransition = print.question('list', 'transition', 'Please select an issue transition from below');
            _.each(transitions, function(transition) {
                whichTransition.choice(transition.name);
            });
            print.ask(whichTransition).then(function(answer) {
                var transition = _.find(transitions, function(t) {
                    return t.name === answer.transition;
                });
                print.info('Story Summary: ' + issue.summary());
                print.ask(
                    print.question('confirm', 'comment', 'Include comments for this transition?')
                ).then(function(commentAnswer) {
                    if (commentAnswer.comment) {
                        // get comments
                        var header = '\n# Please enter your comment and then save and quit. \n' +
                            '# These lines and everything below them will be discarded.\n';
                        vim(header, true).then(function(result) {
                            var comments = transformMentions(_s.trim(result.contents.replace(/#.*/g, '')));
                            if (comments) {
                                print.info(comments);
                                complete(issue, transition, comments);
                            } else {
                                complete(issue, transition);
                            }
                        });
                    } else {
                        complete(issue, transition);
                    }
                });


            });
        }, function(e) {
            print.fail('Failed to fetch transitions. ' + e ? e.message : '');
        });
    }, function(e) {
        print.fail('Failed to fetch issues ' + e ? e.message : '');
    });
};

module.exports.moduleDescription = 'Transition a story (finish, deliver, unstart etc..) based on available transitions';
module.exports.moduleDescriptionExtra = 'Currently does NOT support fields! (Only basic transitions - sorry! It is on the list of todos)';