var Promise = require('bluebird');
var _ = require('underscore');
var _s = require('underscore.string');
var api = require('../core/api');
var print = require('../core/print');
var settings = require('../data/settings');
var priorities = require('../data/jira/priorities');
var components = require('../data/jira/components');

/*
* For now, ignoring custom fields. This is just going
* to be a generic, jira default. Custom fields are a TODO
* */
function BlankIssue(reporter, summary) {

    var self = this;
    this.projectId = null;
    this.summary = summary;
    this.issueTypeId = null;
    this.assigneeName = null;
    this.reporterName = reporter;
    this.priorityId = null;
    this.labels = [];
    this.description = null;
    this.componentIds = [];

    this.toJS = function() {
        var obj = {
            fields: {
                summary: self.summary
            }
        };
        if (self.projectId ) {
            obj.fields.project = { id: self.projectId };
        }
        if (self.issueTypeId ) {
            obj.fields.issuetype = { id: self.issueTypeId };
        }
        if (self.assigneeName ) {
            obj.fields.assignee = { name: self.assigneeName };
        }
        if (self.reporterName ) {
            obj.fields.reporter = { name: self.reporterName };
        }
        if (self.priorityId ) {
            obj.fields.priority = { id: self.priorityId };
        }
        if (self.labels.length) {
            obj.fields.labels = self.labels;
        }
        if (self.description) {
            obj.fields.description = self.description;
        }
        if (self.componentIds.length) {
            obj.fields.components = _.map(self.componentIds, function(c) {
                return { id: c };
            });
        }
        return obj;
    }

}

function complete(newIssue) {
    print.info('The following story will be created:');
    print.info(JSON.stringify(newIssue.toJS(), null, 2));
    print.ask(
        print.question('confirm', 'createIssue', 'Create the story described above? Note, this is super beta and may not work.')
    ).then(function(answer) {
        if (answer.createIssue) {
            api.createIssue(newIssue).then(function(response) {
                if (response.status === 201) {
                    print.success('Story created: ' + JSON.parse(response.payload).key);
                } else {
                    print.fail('Story failed to create, jira responded with \n\n' + response.payload + '\n');
                }
            }, function(e) {
                print.fail(_s.sprintf('Failed to create new issue because %s', e && e.message));
            });
        } else {
            print.fail('Issue was not created');
        }
    });
}

function labeler(newIssue, answer) {
    if (answer.addLabels) {
        print.ask(
            print.question('input', 'suggestion', 'Enter new label name or search criteria')
        ).then(function(suggestions) {
                var s = _s.clean(suggestions.suggestion);
                if (s) {
                    api.labels(s).then(function(response) {
                        var labelSuggestion = response.data;
                        var whichLabelsToAdd =
                            print.question(
                                'checkbox',
                                'labels',
                                'Select labels from below (selecting first option will create it)'
                            ).checkbox(s);
                        _.each(_.filter(labelSuggestion.suggestions, function(sug) {
                            return sug !== s;
                        }), function(it) {
                            whichLabelsToAdd.checkbox(it);
                        });
                        print.ask(whichLabelsToAdd).then(function(labelsAnswer) {
                            _.each(labelsAnswer.labels, function(label) {
                                newIssue.labels.push(label);
                            });
                            print.ask(
                                print.question(
                                    'confirm',
                                    'addLabels',
                                    'Continue adding/searching labels?'
                                )
                            ).then(function(addLabelsAswer) {
                                labeler(newIssue, addLabelsAswer);
                            });
                        });
                    });
                } else {
                    complete(newIssue);
                }
            });
    } else {
        complete(newIssue);
    }
}

function addLabelsOrFinish(newIssue) {
    print.ask(
        print.question('confirm', 'addLabels', 'Would you like to add labels?')
    ).then(function(addLabelsAswer) {
        labeler(newIssue, addLabelsAswer);
    });
}

module.exports = function() {
    if (!settings.gett.username) {
        return print.fail('Please run `jira init` and set your jira username so that you can report issues.');
    }
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

            var summaryQuestion = print.question('input', 'summary', 'Story title')
                .validIf(function(input) {
                    return !!_s.clean(input) || 'Please input a summary';
                });
            var descriptionQuestion = print.question('input', 'description', 'Story description (Not Required)');
            var priorityQuestion = print.question('list', 'priority', 'Select a priority for this story');
            var componentsQuestion = print.question('checkbox', 'components', 'Select components for this story');

            var allPriorites = null;
            var currentComponents = null;

            Promise.all(
                [
                    new Promise(function(resolve) {
                        priorities.list().then(function(priorities) {
                            allPriorites = priorities;
                            _.each(priorities, function(type) {
                                priorityQuestion.choice(type.name);
                            });
                            resolve();
                        })
                    }),
                    new Promise(function(resolve) {
                        components.list().then(function(allComponents) {
                            var components = _.find(allComponents, function(all) {
                                return all.key === project.key;
                            });
                            currentComponents = components.components;
                            _.each(components.components, function(component) {
                                componentsQuestion.checkbox(component.name);
                            });
                            resolve();
                        })
                    })
                ]
            ).then(function() {
                    print.ask(
                        issueTypeQuestion,
                        summaryQuestion,
                        descriptionQuestion,
                        priorityQuestion,
                        componentsQuestion
                    ).then(function(metaAnswers) {
                        api.assignable(project.key).then(function(response2) {
                            var assignable = response2.data;
                            var assigneeQuestion = print.question('list', 'assignee', 'Please select an assignee');
                            assigneeQuestion.separator();
                            assigneeQuestion.choice('None');
                            assigneeQuestion.separator();
                            _.each(assignable, function(assignee) {
                                assigneeQuestion.choice(assignee.displayName);
                            });
                            print.ask(assigneeQuestion).then(function(answers) {
                                var assignee = _.find(assignable, function(it) {
                                    return it.displayName === answers.assignee;
                                });
                                var issueType = _.find(project.issuetypes, function(it) {
                                    return it.name === metaAnswers.type;
                                });
                                var priority = _.find(allPriorites, function(it) {
                                    return it.name === metaAnswers.priority;
                                });
                                var componentNames = metaAnswers.components || [];
                                var newIssue = new BlankIssue(settings.gett.username, metaAnswers.summary);
                                _.each(componentNames, function(name) {
                                    var comp = _.find(currentComponents, function(c) {
                                        return c.name === name;
                                    });
                                    if (comp) {
                                        newIssue.componentIds.push(comp.id);
                                    }
                                });
                                newIssue.projectId = project.id;
                                newIssue.issueTypeId = issueType.id;
                                newIssue.assigneeName = assignee && assignee.name;
                                newIssue.priorityId = priority.id;
                                newIssue.description = metaAnswers.description;
                                addLabelsOrFinish(newIssue);
                            });
                        });
                    });
            });
        });
    });
};


module.exports.moduleDescription = 'Create a new Jira issue.';
module.exports.moduleDescriptionExtra = 'Currently does not support more than default fields.';