var _ = require('underscore');
var api = require('../core/api');
var print = require('../core/print');
var JiraCreateTicketMeta = require('../models/create-meta');

module.exports = function() {
    api.createMeta().then(function(r) {
        var metas = _.map(JSON.parse(r.payload).projects, function(meta) {
            return new JiraCreateTicketMeta(meta);
        });
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
                print.info('You are trying to create a ' + issueTypeAnswer.type + ' in ' + project.name);
                print.info('Thanks! Bye now.');
            });
        });
    });
};
