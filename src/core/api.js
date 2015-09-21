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
var creds = null;
module.exports.init = function(base64credentials) {
    creds = base64credentials;
};

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
            hostname: settings.url,
            port: 443,
            path: path,
            method: method,
            headers: headers
        }, function(res) {
            var payload = '';
            res.on('data', function(d) {
                payload += d;
            });
            res.on('end', function(d) {
                // TODO: if not authorized, prompt to login
                resolve({
                    payload: payload,
                    status: res.statusCode,
                    headers: res.headers
                });
            });
        });
        if (data) {
            request.write(JSON.stringify(data));
        }
        request.on('error', function(e) {
            reject(e);
        });
        request.end();
    });
};

/*
* JIRA Query API
* */

function QueryBuilder() {

    var self = this;
    this.query = {
        jql: '',
        startAt: 0,
        maxResults: 10,
        fields: ['summary', 'issuetype']
    };

    this.search = {
        query: function(query) {
            self.query.jql = _s.sprintf('%s %s ', self.query.jql, query);
            return self;
        },
        and: function(subQuery) {
            self.query.jql = _s.sprintf('%s and %s ', self.query.jql, subQuery);
            return self;
        },
        or: function(subQuery) {
            self.query.jql = _s.sprintf('%s or %s ', self.query.jql, subQuery);
            return self;
        },
        not: function(subQuery) {
            self.query.jql = _s.sprintf('%s not %s ', self.query.jql, subQuery);
            return self;
        },
        empty: function(field) {
            self.query.jql = _s.sprintf('%s %s is empty ', self.query.jql, field);
            return self;
        },
        nil: function(field) {
            self.query.jql = _s.sprintf('%s %s is null ', self.query.jql, field);
            return self;
        },
        orderBy: function(field, priority) {
            if (priority) {
                // asc or desc
                self.query.jql = _s.sprintf('%s order by %s, priority %s', self.query.jql, field, priority);
            } else {
                self.query.jql = _s.sprintf('%s order by %s ', self.query.jql, field);
            }
            return self;
        },
        // operators
        equals: function(subQuery) {
            self.query.jql = _s.sprintf('%s = %s ', self.query.jql, subQuery);
            return self;
        },
        notEquals: function(subQuery) {
            self.query.jql = _s.sprintf('%s != %s ', self.query.jql, subQuery);
            return self;
        },
        greaterThan: function(subQuery) {
            self.query.jql = _s.sprintf('%s > %s ', self.query.jql, subQuery);
            return self;
        },
        greaterThanEquals: function(subQuery) {
            self.query.jql = _s.sprintf('%s >= %s ', self.query.jql, subQuery);
            return self;
        },
        lessThan: function(subQuery) {
            self.query.jql = _s.sprintf('%s < %s ', self.query.jql, subQuery);
            return self;
        },
        lessThanEquals: function(subQuery) {
            self.query.jql = _s.sprintf('%s <= %s ', self.query.jql, subQuery);
            return self;
        },
        in: function(subQuery) {
            self.query.jql = _s.sprintf('%s in %s ', self.query.jql, subQuery);
            return self;
        },
        notIn: function(subQuery) {
            self.query.jql = _s.sprintf('%s not in %s ', self.query.jql, subQuery);
            return self;
        },
        contains: function(subQuery) {
            self.query.jql = _s.sprintf('%s ~ %s ', self.query.jql, subQuery);
            return self;
        },
        is: function(subQuery) {
            self.query.jql = _s.sprintf('%s is %s ', self.query.jql, subQuery);
            return self;
        },
        isNot: function(subQuery) {
            self.query.jql = _s.sprintf('%s is not %s ', self.query.jql, subQuery);
            return self;
        },
        was: function(subQuery) {
            self.query.jql = _s.sprintf('%s was %s ', self.query.jql, subQuery);
            return self;
        },
        wasIn: function(subQuery) {
            self.query.jql = _s.sprintf('%s was in %s ', self.query.jql, subQuery);
            return self;
        },
        wasNotIn: function(subQuery) {
            self.query.jql = _s.sprintf('%s was not in %s ', self.query.jql, subQuery);
            return self;
        },
        wasNot: function(subQuery) {
            self.query.jql = _s.sprintf('%s was not %s ', self.query.jql, subQuery);
            return self;
        },
        changed: function(subQuery) {
            self.query.jql = _s.sprintf('%s changed %s ', self.query.jql, subQuery);
            return self;
        },
        // fields
        fields: {
            affectedVersion: function() {
                self.query.jql = _s.sprintf('%s affectedVersion ', self.query.jql);
                return self;
            },
            assignee: function() {
                self.query.jql = _s.sprintf('%s assignee ', self.query.jql);
                return self;
            },
            attachments: function() {
                self.query.jql = _s.sprintf('%s attachments ', self.query.jql);
                return self;
            },
            category: function() {
                self.query.jql = _s.sprintf('%s category ', self.query.jql);
                return self;
            },
            comment: function() {
                self.query.jql = _s.sprintf('%s comment ', self.query.jql);
                return self;
            },
            component: function() {
                self.query.jql = _s.sprintf('%s component ', self.query.jql);
                return self;
            },
            created: function() {
                self.query.jql = _s.sprintf('%s created ', self.query.jql);
                return self;
            },
            creator: function() {
                self.query.jql = _s.sprintf('%s creator ', self.query.jql);
                return self;
            },
            customField: function() {
                self.query.jql = _s.sprintf('%s customField ', self.query.jql);
                return self;
            },
            description: function() {
                self.query.jql = _s.sprintf('%s description ', self.query.jql);
                return self;
            },
            due: function() {
                self.query.jql = _s.sprintf('%s due ', self.query.jql);
                return self;
            },
            environment: function() {
                self.query.jql = _s.sprintf('%s environment ', self.query.jql);
                return self;
            },
            epicLink: function() {
                self.query.jql = _s.sprintf('%s epicLink ', self.query.jql);
                return self;
            },
            filter: function() {
                self.query.jql = _s.sprintf('%s filter ', self.query.jql);
                return self;
            },
            fixVersion: function() {
                self.query.jql = _s.sprintf('%s fixVersion ', self.query.jql);
                return self;
            },
            issueKey: function() {
                self.query.jql = _s.sprintf('%s issueKey ', self.query.jql);
                return self;
            },
            lastViewed: function() {
                self.query.jql = _s.sprintf('%s lastViewed ', self.query.jql);
                return self;
            },
            level: function() {
                self.query.jql = _s.sprintf('%s level ', self.query.jql);
                return self;
            },
            originalEstimate: function() {
                self.query.jql = _s.sprintf('%s originalEstimate ', self.query.jql);
                return self;
            },
            parent: function() {
                self.query.jql = _s.sprintf('%s parent ', self.query.jql);
                return self;
            },
            priority: function() {
                self.query.jql = _s.sprintf('%s priority ', self.query.jql);
                return self;
            },
            project: function() {
                self.query.jql = _s.sprintf('%s project ', self.query.jql);
                return self;
            },
            remainingEstimate: function() {
                self.query.jql = _s.sprintf('%s remainingEstimate ', self.query.jql);
                return self;
            },
            reporter: function() {
                self.query.jql = _s.sprintf('%s reporter ', self.query.jql);
                return self;
            },
            resolution: function() {
                self.query.jql = _s.sprintf('%s resolution ', self.query.jql);
                return self;
            },
            resolved: function() {
                self.query.jql = _s.sprintf('%s resolved ', self.query.jql);
                return self;
            },
            sprint: function() {
                self.query.jql = _s.sprintf('%s sprint ', self.query.jql);
                return self;
            },
            status: function() {
                self.query.jql = _s.sprintf('%s status ', self.query.jql);
                return self;
            },
            summary: function() {
                self.query.jql = _s.sprintf('%s summary ', self.query.jql);
                return self;
            },
            text: function() {
                self.query.jql = _s.sprintf('%s text ', self.query.jql);
                return self;
            },
            type: function() {
                self.query.jql = _s.sprintf('%s type ', self.query.jql);
                return self;
            },
            timeSpent: function() {
                self.query.jql = _s.sprintf('%s timeSpent ', self.query.jql);
                return self;
            },
            updated: function() {
                self.query.jql = _s.sprintf('%s updated ', self.query.jql);
                return self;
            },
            voter: function() {
                self.query.jql = _s.sprintf('%s voter ', self.query.jql);
                return self;
            },
            votes: function() {
                self.query.jql = _s.sprintf('%s votes ', self.query.jql);
                return self;
            },
            watcher: function() {
                self.query.jql = _s.sprintf('%s watcher ', self.query.jql);
                return self;
            },
            watchers: function() {
                self.query.jql = _s.sprintf('%s watchers ', self.query.jql);
                return self;
            },
            workRatio: function() {
                self.query.jql = _s.sprintf('%s workRatio ', self.query.jql);
                return self;
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

}

module.exports.search = function(query) {
    return api('POST', '/rest/api/2/search', null, query.toQuery());
};

module.exports.queryBuilder = function() {
    return new QueryBuilder();
};