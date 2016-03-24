var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var urlParser = require('url');
var helper = require("./http-helpers");

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

var router = {
  1: '/index.html',
  2: '/styles.css'
};

var flag = true;

exports.handleRequest = function (req, res) {

  if (req.method === "GET") {
    var urlPath = urlParser.parse(req.url).pathname;

    if (urlPath === '/')
      helper.serveAssets(res, '/index.html');
    else {
      helper.serveArchived(res, urlPath, function() {
        archive.isUrlInList(urlPath.slice(1), function(found) {
          if (found) {
            // redirect to loading
            helper.sendRedirect(res, '/loading.html');
          } else {
            helper.sendResponse(res, null, 404);
          }
        });
      });
    }
  }

  if (req.method === "POST") {
    var data = "";
    request.on("data", function(chunk) {
      data += chunk;
    });
    var url = data.split('=')[1]; // www.google.com
    // in sites.txt ?
    archive.isUrlInList(url, function(found) {
      if (found) { // yes:
        // is archived ?
        archive.isUrlArchived(url, function(exists) {
          if (exists) {
            // redirect to site page (/www.google.com)
            utils.sendRedirect(response, '/'+url);
          } else {
            // redirect to loading.html
            utils.sendRedirect(response, '/loading.html');
          }
        });
      } else { // not found
        // append to sites.txt
        archive.addUrlToList(url, function() {
          // redirect to loading.html
          utils.sendRedirect(response, '/loading.html');
        });
      }
    });
        request.on("end", function() {
      callback(data);
    });
  }
  // res.end(archive.paths.list);
};
