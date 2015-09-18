/*
* JIRA API
*
* This class relies on the credentials file for authentication
* At anytime if it gets a not authorized response, it will fail
* and clear your credentials file, prompting you to login on
* retry
* */
var creds = null;
module.exports.init = function(base64credentials) {
    creds = base64credentials;
};