var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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

exports.readListOfUrls = function() {
};

exports.isUrlInList = function(file) {
  filePath = this.paths.list;
  console.log("33: FilePath:", this.paths.list);
  var data;

  fs.readFile(filePath, 'UTF8', function(err, content){
    console.log("37ReadFile");
    if(err){
        console.log("37throwErr");
      throw err;
    } else {

      console.log("41Content", content);
      data = content.split(',');

      if(data.indexOf(file) !== -1) {
        return true;
      } else {
        return false;
      }
      console.log("41", data);
    }
  });


};


exports.addUrlToList = function() {
};

exports.isUrlArchived = function() {


};

exports.downloadUrls = function() {
};
