/*
* JIRA API
*
* This class relies on the credentials file for authentication
* At anytime if it gets a not authorized response, it will fail
* and clear your credentials file, prompting you to login on
* retry
* */
var Promise = require('bluebird');
var https = require('https');
var settings = require('../data/settings');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('./print');
var creds = null;
module.exports.init = function(base64credentials) {
    creds = base64credentials;
};

/*
* Models
* */
var JiraUser = require('../models/user');
var JiraCreateTicketMeta = require('../models/create-meta');
var JiraIssue = require('../models/issue');
var JiraStatus = require('../models/status.js');
var JiraPriority = require('../models/priority.js');
var JiraProject = require('../models/project.js');
var JiraComponent = require('../models/component.js');
var LabelSuggestion = require('../models/label-suggestion.js');

function api(method, path, headers, data) {
    return new Promise(function(resolve, reject) {
        headers = headers || {};
        // if creds are set, set authorization
        if (creds) {
            headers['Authorization'] = _s.sprintf('Basic %s', creds);
        }
        // All of JIRAs apis are application json, if data, set type
        headers['Content-Type'] = 'application/json';
        var request = https.request({
            hostname: settings.gett.url,
            port: 443,
            path: path,
            method: method,
            headers: headers
        }, function (res) {
            var payload = '';
            res.on('data', function (d) {
                payload += d;
            });
            res.on('end', function (d) {
                if (res && (res.statusCode === 403 || res.statusCode === 401)) {
                    print.fail('Not authorized. Try logging out and back in.');
                    reject(new Error('Unauthorized'));
                    var deniedReason = res.headers['x-authentication-denied-reason'];
                    if (deniedReason && deniedReason.indexOf('CAPTCHA_CHALLENGE') > -1) {
                        print.fail('Your account has been locked. You need to LOGOUT and log back in manually via jira: ' + deniedReason.match(/login-url=(.*)/)[1]);
                    }
                } else {
                    resolve({
                        payload: payload,
                        status: res.statusCode,
                        headers: res.headers
                    });
                }
            });
        });
        if (data) {
            request.write(JSON.stringify(data));
        }
        request.on('error', function (e) {
            if (e && e.code === 'ECONNREFUSED') {
                print.fail('Failed to connect. Did you run jira init? Please do this.');
            }
            reject(e);
        });
        request.end();
    });
};

function apiList(type, payloadKey, method, path, headers, data) {
    return new Promise(function(resolve, reject) {
        api(method, path, headers, data).then(function(response) {
            var deserialized = JSON.parse(response.payload);
            response.data = _.map(payloadKey ? deserialized[payloadKey] : deserialized, function(item) {
                return new type(item);
            });
            resolve(response);
        }, reject);
    });
}

function apiListRoot(type, method, path, headers, data) {
    return apiList(type, null, method, path, headers, data);
}

function apiItem(type, method, path, headers, data) {
    return new Promise(function(resolve, reject) {
        api(method, path, headers, data).then(function(response) {
            response.data = new type(JSON.parse(response.payload));
            resolve(response);
        }, reject);
    });
}

/*
* JIRA Query API
* */

function QueryBuilder() {

    var self = this;
    this.query = {
        jql: '',
        startAt: 0,
        maxResults: 10,
        fields: [
            'summary',
            'issuetype',
            'project',
            'resolution',
            'resolutiondate',
            'creator',
            'reporter',
            'priority',
            'labels',
            'votes',
            'assignee',
            'status',
            'updated'
        ]
    };

    this.search = {
        query: function() {
            return self;
        },
        raw: function(query) {
            self.query.jql = _s.sprintf('%s %s ', self.query.jql, query);
            return self.search;
        },
        and: function() {
            self.query.jql = _s.sprintf('%s and ', self.query.jql);
            return self.search;
        },
        or: function() {
            self.query.jql = _s.sprintf('%s or ', self.query.jql);
            return self.search;
        },
        not: function(subQuery) {
            self.query.jql = _s.sprintf('%s not %s ', self.query.jql, subQuery);
            return self.search;
        },
        empty: function(field) {
            self.query.jql = _s.sprintf('%s %s is empty ', self.query.jql, field);
            return self.search;
        },
        nil: function(field) {
            self.query.jql = _s.sprintf('%s %s is null ', self.query.jql, field);
            return self.search;
        },
        orderBy: function(field, priority) {
            if (priority) {
                // asc or desc
                self.query.jql = _s.sprintf('%s order by %s, priority %s', self.query.jql, field, priority);
            } else {
                self.query.jql = _s.sprintf('%s order by %s ', self.query.jql, field);
            }
            return self.search;
        },
        // operators
        equals: function(subQuery) {
            self.query.jql = _s.sprintf('%s = %s ', self.query.jql, subQuery);
            return self.search;
        },
        notEquals: function(subQuery) {
            self.query.jql = _s.sprintf('%s != %s ', self.query.jql, subQuery);
            return self.search;
        },
        greaterThan: function(subQuery) {
            self.query.jql = _s.sprintf('%s > %s ', self.query.jql, subQuery);
            return self.search;
        },
        greaterThanEquals: function(subQuery) {
            self.query.jql = _s.sprintf('%s >= %s ', self.query.jql, subQuery);
            return self.search;
        },
        lessThan: function(subQuery) {
            self.query.jql = _s.sprintf('%s < %s ', self.query.jql, subQuery);
            return self.search;
        },
        lessThanEquals: function(subQuery) {
            self.query.jql = _s.sprintf('%s <= %s ', self.query.jql, subQuery);
            return self.search;
        },
        in: function(items) {
            if (!(items instanceof Array)) {
                items = [items];
            }
            self.query.jql = _s.sprintf('%s in (%s) ', self.query.jql, _.map(items, function(item) {
                return '"' + item + '"';
            }).join(','));
            return self.search;
        },
        notIn: function(subQuery) {
            self.query.jql = _s.sprintf('%s not in %s ', self.query.jql, subQuery);
            return self.search;
        },
        contains: function(subQuery) {
            self.query.jql = _s.sprintf('%s ~ "%s" ', self.query.jql, subQuery);
            return self.search;
        },
        is: function(subQuery) {
            self.query.jql = _s.sprintf('%s is %s ', self.query.jql, subQuery);
            return self.search;
        },
        isNot: function(subQuery) {
            self.query.jql = _s.sprintf('%s is not %s ', self.query.jql, subQuery);
            return self.search;
        },
        was: function(subQuery) {
            self.query.jql = _s.sprintf('%s was %s ', self.query.jql, subQuery);
            return self.search;
        },
        wasIn: function(subQuery) {
            self.query.jql = _s.sprintf('%s was in %s ', self.query.jql, subQuery);
            return self.search;
        },
        wasNotIn: function(subQuery) {
            self.query.jql = _s.sprintf('%s was not in %s ', self.query.jql, subQuery);
            return self.search;
        },
        wasNot: function(subQuery) {
            self.query.jql = _s.sprintf('%s was not %s ', self.query.jql, subQuery);
            return self.search;
        },
        changed: function(subQuery) {
            self.query.jql = _s.sprintf('%s changed %s ', self.query.jql, subQuery);
            return self.search;
        },
        // jira search functions
        time: {
            now: function() {
                self.query.jql = _s.sprintf('%s now() ', self.query.jql);
                return self.search;
            },
            startOfDay: function() {
                self.query.jql = _s.sprintf('%s startOfDay() ', self.query.jql);
                return self.search;
            },
            startOfWeek: function() {
                self.query.jql = _s.sprintf('%s startOfWeek() ', self.query.jql);
                return self.search;
            },
            startOfMonth: function() {
                self.query.jql = _s.sprintf('%s startOfMonth() ', self.query.jql);
                return self.search;
            },
            startOfYear: function() {
                self.query.jql = _s.sprintf('%s startOfYear() ', self.query.jql);
                return self.search;
            },
            endOfDay: function() {
                self.query.jql = _s.sprintf('%s endOfDay() ', self.query.jql);
                return self.search;
            },
            endOfWeek: function() {
                self.query.jql = _s.sprintf('%s endOfWeek() ', self.query.jql);
                return self.search;
            },
            endOfMonth: function() {
                self.query.jql = _s.sprintf('%s endOfMonth() ', self.query.jql);
                return self.search;
            },
            endOfYear: function() {
                self.query.jql = _s.sprintf('%s endOfYear() ', self.query.jql);
                return self.search;
            }
        },
        // fields
        fields: {
            affectedVersion: function() {
                self.query.jql = _s.sprintf('%s affectedVersion ', self.query.jql);
                return self.search;
            },
            assignee: function() {
                self.query.jql = _s.sprintf('%s assignee ', self.query.jql);
                return self.search;
            },
            attachments: function() {
                self.query.jql = _s.sprintf('%s attachments ', self.query.jql);
                return self.search;
            },
            category: function() {
                self.query.jql = _s.sprintf('%s category ', self.query.jql);
                return self.search;
            },
            comment: function() {
                self.query.jql = _s.sprintf('%s comment ', self.query.jql);
                return self.search;
            },
            component: function() {
                self.query.jql = _s.sprintf('%s component ', self.query.jql);
                return self.search;
            },
            created: function() {
                self.query.jql = _s.sprintf('%s created ', self.query.jql);
                return self.search;
            },
            creator: function() {
                self.query.jql = _s.sprintf('%s creator ', self.query.jql);
                return self.search;
            },
            customField: function() {
                self.query.jql = _s.sprintf('%s customField ', self.query.jql);
                return self.search;
            },
            description: function() {
                self.query.jql = _s.sprintf('%s description ', self.query.jql);
                return self.search;
            },
            due: function() {
                self.query.jql = _s.sprintf('%s due ', self.query.jql);
                return self.search;
            },
            environment: function() {
                self.query.jql = _s.sprintf('%s environment ', self.query.jql);
                return self.search;
            },
            epicLink: function() {
                self.query.jql = _s.sprintf('%s epicLink ', self.query.jql);
                return self.search;
            },
            filter: function() {
                self.query.jql = _s.sprintf('%s filter ', self.query.jql);
                return self.search;
            },
            fixVersion: function() {
                self.query.jql = _s.sprintf('%s fixVersion ', self.query.jql);
                return self.search;
            },
            issueKey: function() {
                self.query.jql = _s.sprintf('%s issueKey ', self.query.jql);
                return self.search;
            },
            lastViewed: function() {
                self.query.jql = _s.sprintf('%s lastViewed ', self.query.jql);
                return self.search;
            },
            level: function() {
                self.query.jql = _s.sprintf('%s level ', self.query.jql);
                return self.search;
            },
            originalEstimate: function() {
                self.query.jql = _s.sprintf('%s originalEstimate ', self.query.jql);
                return self.search;
            },
            parent: function() {
                self.query.jql = _s.sprintf('%s parent ', self.query.jql);
                return self.search;
            },
            priority: function() {
                self.query.jql = _s.sprintf('%s priority ', self.query.jql);
                return self.search;
            },
            project: function() {
                self.query.jql = _s.sprintf('%s project ', self.query.jql);
                return self.search;
            },
            remainingEstimate: function() {
                self.query.jql = _s.sprintf('%s remainingEstimate ', self.query.jql);
                return self.search;
            },
            reporter: function() {
                self.query.jql = _s.sprintf('%s reporter ', self.query.jql);
                return self.search;
            },
            resolution: function() {
                self.query.jql = _s.sprintf('%s resolution ', self.query.jql);
                return self.search;
            },
            resolved: function() {
                self.query.jql = _s.sprintf('%s resolved ', self.query.jql);
                return self.search;
            },
            sprint: function() {
                self.query.jql = _s.sprintf('%s sprint ', self.query.jql);
                return self.search;
            },
            status: function() {
                self.query.jql = _s.sprintf('%s status ', self.query.jql);
                return self.search;
            },
            summary: function() {
                self.query.jql = _s.sprintf('%s summary ', self.query.jql);
                return self.search;
            },
            text: function() {
                self.query.jql = _s.sprintf('%s text ', self.query.jql);
                return self.search;
            },
            type: function() {
                self.query.jql = _s.sprintf('%s type ', self.query.jql);
                return self.search;
            },
            timeSpent: function() {
                self.query.jql = _s.sprintf('%s timeSpent ', self.query.jql);
                return self.search;
            },
            updated: function() {
                self.query.jql = _s.sprintf('%s updated ', self.query.jql);
                return self.search;
            },
            voter: function() {
                self.query.jql = _s.sprintf('%s voter ', self.query.jql);
                return self.search;
            },
            votes: function() {
                self.query.jql = _s.sprintf('%s votes ', self.query.jql);
                return self.search;
            },
            watcher: function() {
                self.query.jql = _s.sprintf('%s watcher ', self.query.jql);
                return self.search;
            },
            watchers: function() {
                self.query.jql = _s.sprintf('%s watchers ', self.query.jql);
                return self.search;
            },
            workRatio: function() {
                self.query.jql = _s.sprintf('%s workRatio ', self.query.jql);
                return self.search;
            }
        }
    };

    this.withProject = function(project) {
        self.query.project = project;
        return self;
    };

    this.withAssignee = function(assignee) {
        self.query.assignee = assignee;
        return self;
    };

    this.withStartAt = function(startIndex) {
        self.query.startAt = startIndex;
        return self;
    };

    this.withMaxResults = function(maxResults) {
        self.query.maxResults = maxResults;
        return self;
    };

    this.withFields = function(fieldsArray) {
        _.each(fieldsArray, function(f) {
            self.query.fields.push(f);
        });
        return self;
    };

    this.toQuery = function() {
        self.query.jql = _s.clean(self.query.jql);
        return self.query;
    };

    this.toString = function() {
        return self.toQuery().jql;
    };

}

module.exports.queryBuilder = function() {
    return new QueryBuilder();
};

module.exports.search = function(query) {
    return apiList(JiraIssue, 'issues', 'POST', '/rest/api/2/search', null, query.query().toQuery());
};

module.exports.statuses = function() {
    return apiListRoot(JiraStatus, 'GET', '/rest/api/2/status');
};

module.exports.priorities = function() {
    return apiListRoot(JiraPriority, 'GET', '/rest/api/2/priority');
};

module.exports.projects = function() {
    return apiListRoot(JiraProject, 'GET', '/rest/api/2/project');
};

module.exports.issue = function(key) {
    return apiItem(JiraIssue, 'GET', '/rest/api/2/issue/' + key);
};

/*
 * Fetches projects, then fetches all components for each project
 * keying them by project
 * */
module.exports.allComponents = function() {
    return new Promise(function(resolve, reject) {
        apiListRoot(JiraProject, 'GET', '/rest/api/2/project').then(function(response) {
            var projects = response.data;
            var promises = [];
            _.each(projects, function(project) {
                promises.push(apiListRoot(JiraComponent, 'GET', '/rest/api/2/project/' + project.id + '/components'))
            });
            Promise.all(promises).then(function(results) {
                var result = [];
                for (var i = 0; i < projects.length; i++) {
                    result.push({
                        key: projects[i].key,
                        components: results[i].data
                    });
                }
                // pass down data key for cache
                resolve({
                    data: result
                });
            }, reject);
        }, reject);
    });
};

module.exports.labels = function(token) {
    return apiItem(LabelSuggestion, 'GET', '/rest/api/1.0/labels/suggest?query=' + token);
};

module.exports.assignable = function(projectKey) {
    return apiListRoot(JiraUser, 'GET', '/rest/api/2/user/assignable/search?project=' + projectKey);
};

module.exports.createMeta = function() {
    return apiList(JiraCreateTicketMeta, 'projects', 'GET', '/rest/api/2/issue/createmeta');
};
