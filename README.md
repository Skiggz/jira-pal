#Jira Pal

####Jira UI can be a bit busy sometimes. This tool aims to simplify jira use for terminal users

##Installation

* Install `node` if you do not have it
* Install `npm` if applicable
* Run `npm install jira-pal --global`
  * I suggest aliasing this to something easy to type (I used `jira`)
* Run commands. Suggested initial command `node jira.js init`

Notes about manual installation

* If you pull down this repo to use this manually, you may want to add an alias to your environment
  * Bash example: `alias jira='node /path/to/this/repo/src/jira.js'`

##Usage

* `jira-pal <command> <options`

##Examples

* `jira-pal help`
  * View list of commands and what they do
* `jira-pal login`
  * Store my login information
* `jira-pal logout`
  * Clear my login information
* `jira-pal init`
  * Set up your settings for your jira distribution and usage preferences
* `jira-pal me`
  * Returns all stories you are assigned to, that fall under your default me statuses from `jira-pal init`
* `jira-pal me foobar`
  * Returns all stories you are assigned to that search returns "foobar" for (i.e. search my stories)
* `jira-pal copy`
  * Copy a story key (id) from the result set returned by `jira-pal me`
* `jira-pal copy foobar`
  * Copy a story id from ANY story that search returns for search critiera `foobar`
* `jira-pal search`
  * Same as `jira-pal me`
* `jira-pal search foobar`
  * Search for any story containing foobar in jira
* `jira-pal list s` or `jira-pal list statuses`
  * List all options for jira statuses, this is useful for changing your default `me` command statuses
* `jira-pal prime`
  * Prime caches for various jira information that doesnt change often, like statuses
* `jira-pal evict`
  * Clear caches

##Settings

* Default settings are stored in `data/settings.js`
* To override settings you can add your own `data/settings-override.js`
  * This happens when you run `jira-pal init`. Make your life easier and just run that command and follow the prompts
  * These settings will EXTEND `data/settings.js` meaning only keys present are over written
  * Make sure your `data/settings-override.js` exports a js object with desired settings
  
###Current Settings Options

* `url`: The url for your jira installation. `Required`
* `colors`: If truthy, show terminal colors in output. Default `true`
* `credentialsFileLocation`: Tells the application where to store the base64 basic auth credentials
* `username`: Jira username. This is used for fetching YOUR assigned stories and other various tasks related to you
  * Find this by navigating to your jira profile. The URL should look like `.../secure/ViewProfile.jspa?name=USERNAME`
* `defaultCommand`: The default command that runs when you run `node jira.js`. Default `help`. Suggested `me`.
* `defaultMeStatuses`: The statuses to include in your `me` search. Default `In Progress`. This is a CSV. (Ex: `Foo Status,Done,My Status`)

##Security

* All endpoints are hit over HTTPS using Basic Authentication
* Credentials are stored locally, and the file is not shared remotely
* The alternative solution is to implement oauth, but since it's a terminal app I've chosen the simpler route
* This leaves majority of security up to the user to control, if you share your local credentials file, you may have a bad time
* On non successful auth of any endpoint call, your credentials are removed and required on next use

##Commands

* All commands are in commands folder
* See `core/commands` for documentation about adding commands and some features that exist

More coming soon