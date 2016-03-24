var fs = require('fs');
var request = require('request');
var path = require('path');
var _ = require('underscore');
var handler = require("../web/request-handler");

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'UTF8', function (err, data) {
    if (err) throw err;
    var siteList = data.toString().split('\n');
    callback(siteList);
  });
};

exports.isUrlInList = function(url, callback) {
  var found = false;
  exports.readListOfUrls(function(sites) {
    if (sites.indexOf(url) > -1)
      found = true;
  });
  callback(found);
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    if(err) throw err;
  });
  callback();
};

exports.isUrlArchived = function(url, callback) {
  var filePath = exports.paths.archivedSites + url;

  fs.exists(filePath, function(archived) {
    callback(archived);
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function(url) {
    if (!url) return;
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + "/" + url));
  });
};
