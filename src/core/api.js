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