var _s = require('underscore.string');
var fs = require('fs');
var settings = require('../data/settings');
/*
* Username and Password base64 auth encoding
* is stored in the credentials file and used
* for each request. It's like a dumb file
* store as a node module. It's not super
* awesome or anything, but it's easy and
* most people should be sharing that file,
* so in majority of cases it's pretty secure.
* I've added the file to git ignore to help
* silly developers from accidentally pushing
* credentials in a PR or fork as well.
* */
module.exports = function(username, password) {
    // store basic base64 auth creds in creds module file
    var login = new Buffer(_s.sprintf('%s:%s', username, password)).toString('base64');
    fs.writeFileSync(settings.credentialsFileLocation, _s.sprintf('module.exports = \'%s\';\n', login));
    return login;
};

module.exports.requiresLogin = false;
module.exports.moduleDescription = 'Populates base64 locally stored credentials';
module.exports.moduleDescriptionExtra = 'Populates base64 locally stored credentials';