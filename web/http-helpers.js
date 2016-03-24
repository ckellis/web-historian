var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var handler = require("./request-handler");
var url = require('url');

exports.serveAssets = function(res, asset) {
  fs.readFile(archive.paths.siteAssets + asset, 'UTF8', function(err, data) {
    err ? exports.sendResponse(res, data, 404) : exports.sendResponse(res, data);
  });
};

exports.serveArchived = function(res, archivedSite, callback) {
  fs.readFile(archive.paths.archivedSites + archivedSite, 'UTF8', function(err, data) {
    (err && callback) ? callback() : exports.sendResponse(res, data);
  });
};

exports.sendResponse = function(res, data, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(data);
};

exports.sendRedirect = function(res, location, status) {
  status = status || 302;
  res.writeHead(status, {Location: location});
  res.end();
};

// exports.collectData = function(request, callback) {
//   var data = "";
//   request.on("data", function(chunk) {
//     data += chunk;
//   });
//   request.on("end", function() {
//     callback(data);
//   });
// };
