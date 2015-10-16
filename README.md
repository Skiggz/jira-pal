#Jira Pal

####A jira terminal tool aimed to reduce or eliminate the need for the UI. Jira pal wants to save you a browser tab :)

##What People Are Probably Saying

>Wow!

>I never knew life without the JIRA UI, this is life changing!

>I can't believe it's not butter! I'd totally put it on some toast. 

And many other positive things :D

##Installation

* Install `node` if you do not have it
* Install `npm` if applicable
* Run `npm install jira-pal --global`
* Run commands. Suggested initial command `jira init`

##Possible Issues with NPM and Node

* Setting up NPM can be real fun, or not real fun. You may need to use `sudo` for your installs on unix environments
* If you run into permission issues, [Try This!](https://docs.npmjs.com/getting-started/fixing-npm-permissions)
  * Particularly changing ownership of your npm directory

##Possible Issues with Jira Pal!
* Yep, it's still young. If you encounter a bug, please add a github issue
* If things seem to get totally borked, try running `jira logout`, `jira evict` and then re running `jira init`.
  * These are always safe bets to start over.

##Possible Issues with installing (errors about fetching dependencies)
* Make sure you have an SSH key setup in git :)

##Usage

* `jira <command> <options`

##Setup via init 

* You want to run `jira init`
* You want to get your jira url and username correct ;)
* You want to make sure you include a list of applicable statuses that you want to see when you run jira me, because they are used for a lot of commands
  * For example, with my jira distribution, we have "Started" and "In Review" along with "In Progress" so when `jira init` asks me what statuses to use, I enter: `In Progress,Started,In Review`
* You probably want to sort your stories for me commands by rank or priority.
  * So when it asks me, I put `Rank` to get my stories coming back in the order they are in in our backlog
* You probably want to set your me command stories to come back only if they are in active sprints, so answer the last question "yes"

One last note about setup, the reason you keep hearing "me" commands is that the general premise of the application is 
that most commands default to your "me" commands unless otherwise specified, either by search criteria or the nature of 
the particular command you are using. So you'll have a much better time if you pick statuses for your "me" commands that 
make sense to you and what you want.

##TLDR

Examples can be found below under "Examples" or by running `jira help`. But if you're just getting started, try:

* `jira init`
* `jira me`
* `jira copy`
* `jira commit` (inside of a directory that is git tracked with changes staged)
* `jira me some search text` where "some search text" is some text in a story you are looking for, assigned to you
* `jira board` or `jira board -a` or `jira board -p my-project`
* `jira new` (create a story)
* `jira open`
* `jira comment`
* `jira flow` to change story states
* `jira user lookup bob`

There is obviously a lot of enhancements coming, but I think the above commands are good starting points for learning the tool. More below.

##Examples

* `jira help`
  * View list of commands and what they do
* `jira login`
  * Store my login information
* `jira logout`
  * Clear my login information
* `jira init`
  * Set up your settings for your jira distribution and usage preferences
* `jira lookup`
  * Raw advanced search functionality. `search`, `me`, and `copy` commands all use text contains search. If you want full on search using JQL, use `lookup`.
* `jira me`
  * Returns all stories you are assigned to, that fall under your default me statuses from `jira init`
* `jira me foobar`
  * Returns all stories you are assigned to that search returns "foobar" for (i.e. search my stories)
* `jira commit`
  * Select issues from `jira me` or a search (like jira me) to include in a `git commit` message
* `jira new`
  * Create a new issue (default fields only supported at the moment, more to come)
* `jira board`
  * View the sprint board for a selected rapid board.
  * You may pass -a to include all users (default is just your username)
  * Specify -p XXX to specify a rapid board by id (p for project, maybe not the best name)
* `jira open`
  * Select from issues assigned to you and open it in your default web browser.
* `jira flow`
  * Transition an issue. This is the "workflow" part of jira. Currently only supports basic transitions. If you have field requirements, this won't work yet.
* `jira open XXX-123`
  * Opens the issue in your default web browser.
* `jira issue XXX-123`
  * JSON Representation of specified issue. Pass story ID or key, and optionally `-a` to include all fields
* `jira open -s foobar`
  * Open an issue in your default web browser from ANY story that search returns for search criteria `foobar`
* `jira comment`
  * Select from issues assigned to you and then add a comment
    * You can @mention a user or [~username]
* `jira comment XXX-123`
  * Add comment to the specified issue
* `jira comment -s foobar`
  * Add comment to ANY story that search returns for search criteria `foobar`
* `jira watch`
  * Select from issues assigned to you to watch
* `jira watch XXX-123`
  * Watch the specified issue
* `jira watch -s foobar`
  * Watch ANY story that search returns for search criteria `foobar`
* `jira unwatch`
  * Select from issues assigned to you to stop watching
* `jira unwatch XXX-123`
  * Stop watching the specified issue
* `jira unwatch -s foobar`
  * Stop watching ANY story that search returns for search criteria `foobar`
* `jira describe`
  * Describe an issue assigned to you
* `jira describe XXX-123`
  * Describe a specific issue
* `jira describe -s foobar`
  * Describe ANY story that search returns for search criteria `foobar`
* `jira copy`
  * Copy a story key (id) from the result set returned by `jira me`
* `jira copy foobar`
  * Copy a story id from ANY story that search returns for search criteria `foobar`
* `jira user lookup foobar`
  * Searches for a users where email, username or display name match `foobar`
* `jira search`
  * Same as `jira me`
* `jira search foobar`
  * Search for any story containing foobar in jira
* `jira list s` or `jira list statuses`
  * List all options for jira statuses, this is useful for changing your default `me` command statuses
* `jira prime`
  * Prime caches for various jira information that doesnt change often, like statuses
* `jira evict`
  * Clear caches

##Searching

* As noted in the examples above, `lookup` is the command you want to use to enter raw jql queries. There is an example using `jira help lookup`.
* JQL is defined here on jiras website under [Advanced Searching](https://confluence.atlassian.com/jira/advanced-searching-179442050.html)
* `search`, `me` and `copy` commands all search using "text contains ____" where the blank is whatever you type
  * Example: `jira search foobar` is actually doing a JQL search of "text contains foobar"

##Hacking

* If you are using jira locally via pulling down the repo, and using the live version via npm you may want to:
  * Alias your local jira-pal jira.js file for ease of use

##Settings

* Default settings are stored in `data/settings.js`
* To override settings run `jira init` and follow the prompts
  * These settings will EXTEND `data/settings.js` meaning only keys present are over written
* Jira pal stores settings and crednetials in a folder `.jira-pal` in your home directory
  * If you would like to change this, set system environment variable `JIRA_PAL_HOME`;

###Current Settings Options

* `url`: The url for your jira installation. `Required`
* `colors`: If truthy, show terminal colors in output. Default `true`
* `username`: Jira username. This is used for fetching YOUR assigned stories and other various tasks related to you
  * Find this by navigating to your jira profile. The URL should look like `.../secure/ViewProfile.jspa?name=USERNAME`
* `defaultCommand`: The default command that runs when you run `node jira.js`. Default `help`. Suggested `me`.
* `orderByDefault`: Order your me searches by a particular field. In many cases "Rank" or "Priority" is desired..
* `useActiveSprintsForMeCommand`: If yes, the jql "sprint in openSprints()" is used for searching, to avoid bringing back all kinds of random stories that match desired criteria.
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
