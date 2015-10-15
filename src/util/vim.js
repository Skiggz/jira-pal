var Promise = require('bluebird');
var proc = require('child_process');
var fs = require('fs');
var print = require('../core/print');
var settings = require('../data/settings');
/*
* Creates a temp file
* Opens the file in vim
* On exit, reads the file and resolves the text in the file
* and deletes the file (or attempts to, if specified)
*
* Notes: Instead of creating a temp file in the os
* it creates a temp file in our .jira-pal directory.
* This makes it easier to avoid permission conflicts
* and if for some reason the temp files aren't deleted
* by us or the OS, they are in a easy to find place
* */
module.exports = function(initialContents, deleteFile) {
    return new Promise(function(resolve) {
        var filename = settings.directory() + '/jira-pal-vim.tmp';
        fs.writeFileSync(filename, initialContents || '');
        var vim = proc.spawn('vim', [filename], {
            stdio: 'inherit'
        });
        vim.on('exit', function() {
            var contents = fs.readFileSync(filename);
            if (deleteFile) {
                fs.unlinkSync(filename);
            }
            resolve({
                filename: filename,
                contents: contents.toString('utf-8')
            });
        });
    });
};