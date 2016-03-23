var fs = require('fs');
var http = require('http');
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

exports.isUrlInList = function(url) {
  fs.readFile(this.paths.list, 'UTF8', function (err, data) {
    if (err) throw err;
    else if(data.indexOf(url) < 0){
     return false;
    } else {
      return true;
    }
  });
};

exports.addUrlToList = function(filePath) {
  if(!this.isUrlInList(filePath)){
    fs.appendFile(this.paths.list, filePath, function(err) {
      if(err)
        throw err;
    });
  }
};

exports.isUrlArchived = function(filePath) {
  filePath = this.paths.archivedSites + filePath;
  try {
    return fs.statSync(filePath).isFile();
  }
    catch (err)
  {
    return false;
  }
};

exports.downloadUrls = function(target){
  http.get({
    url: 'http://' + target,
    progress: function (current, total) {
      console.log('downloaded %d bytes from %d', current, total);
    }
  }, path.join(exports.paths.archivedSites, target), function (err, res) {
    if (err) {
      console.error(err);
      return;
    }

    console.log(res.code, res.headers, res.file);
  });
};
