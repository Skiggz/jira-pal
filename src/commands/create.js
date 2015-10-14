var _ = require('underscore');
var api = require('../core/api');
var print = require('../core/print');


module.exports = function() {
    api.createMeta().then(function(response) {
        var metas = response.data;
        /*
        * List available projects
        * */
        var projectQuestion = print.question('list', 'project', 'Select a project');
        _.each(metas, function(meta) {
            projectQuestion.choice(meta.name);
        });
        print.ask(projectQuestion).then(function(projectAnswer) {
            var project = _.find(metas, function(meta) { return meta.name === projectAnswer.project; });
             // Once they have picked a project, ask them to pick a type
            var issueTypeQuestion = print.question('list', 'type', 'Select an issue type for project ' + project.name);
            _.each(project.issuetypes, function(type) {
                issueTypeQuestion.choice(type.name);
            });
            print.ask(issueTypeQuestion).then(function(issueTypeAnswer) {
                var assigneeQuestion = print.question('list', 'assignee', 'Please select an assignee');
                api.assignable(project.key).then(function(response2) {
                    var assignable = response2.data;
                    assigneeQuestion.choice('None');
                    _.each(assignable, function(assignee) {
                        assigneeQuestion.choice(assignee.displayName);
                    });
                    print.ask(assigneeQuestion).then(function(answers) {
                        var assignee = _.find(assignable, function(it) {
                            return it.displayName === answers.assignee;
                        });
                        if (answers.assignee !== 'None') {
                            print.info('You are trying to create a ' + issueTypeAnswer.type + ' in ' + project.name + ' assigned to ' + assignee.displayName);
                        } else {
                            print.info('You are trying to create a ' + issueTypeAnswer.type + ' in ' + project.name);
                        }
                    });
                });
            });
        });
    });
};
