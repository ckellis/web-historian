var path = require('path');
var archive = require('../helpers/archive-helpers');
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

var router = {
  1: '/index.html',
  2: '/styles.css'
};

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
    helper.collectData(req, function(data) {
      var url = data.split('=')[1];

      archive.isUrlInList(url, function(found) {
        if (found) {
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              helper.sendRedirect(res, '/' + url);
            } else {
              helper.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            helper.sendRedirect(res, '/loading.html');
          });
        }
      });
    });
  }
};
