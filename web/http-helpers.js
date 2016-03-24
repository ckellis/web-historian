var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var handler = require("./request-handler");
var url = require('url');

exports.serveAssets = function(res, asset, callback) {
  // 1. check in public folder
  fs.readFile(archive.paths.siteAssets + asset, 'UTF8', function(err, data) {
    if (err) {
      // 2. file doesn't exist in public, check archive folder
      fs.readFile(archive.paths.archivedSites + asset, 'UTF8', function(err, data) {
        if (err) {
          // 3. file doesn't exist in either location
          callback ? callback() : exports.sendResponse(res, data, 404);
        } else {
          // file exists, serve it
          exports.sendResponse(res, data);
        }
      });
    } else {
      // file exists, serve it
      exports.sendResponse(res, data);
    }
  });
};

exports.sendResponse = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};


exports.sendRedirect = function(res, location, status){
  status = status || 302;
  res.writeHead(status, {Location: location});
  res.end();
};

exports.collectData = function(request, callback){
  var data = "";
  request.on("data", function(chunk){
    data += chunk;
  });
  request.on("end", function(){
    callback(data);
  });
};
