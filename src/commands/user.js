var _ = require('underscore');
var _s = require('underscore.string');
var print = require('../core/print');
var selectIssue = require('../util/select-issue');
var api = require('../core/api');

module.exports = function() {
    var args = Array.prototype.slice.call(arguments),
        action = args.shift();

    switch(action) {
        case 'lookup':
            api.searchForUser(args.join(' '))
                .then(
                    function(r) {
                        var data = JSON.parse(r.payload, 'UTF-8'),
                            rows = _.map(data, function(it) {
                                return [it.displayName, it.name, it.emailAddress];
                            });

                        print.table([ 'Name', 'Username', 'Email' ], rows, {
                            widths: [ 30, 30, 60 ]
                        });

                    },
                    function(e) {
                        console.error('There was a problem looking up users', e);
                    }
                );
        break;
        default:
            console.error('Command not supported:', action);
        break;
    }
};

module.exports.moduleDescription = 'User commands';
module.exports.moduleDescriptionExtra = 'Example: jira user lookup foobar';
