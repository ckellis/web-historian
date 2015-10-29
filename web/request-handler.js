var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var fs = require('fs');
var url = require('url');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var router = {
  '/': '/index.html'
  // ...
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

exports.handleRequest = function (req, res) {
  //console.log("6: handleRequest:", req);
  if(req.method === "GET") {
    var parts = url.parse(req.url);
    var route = parts.pathname;

    if(route === '/') {
      console.log("30" , route);
      var filePath = archive.paths.siteAssets + router[route];
      console.log(filePath);
      fs.readFile(filePath, 'UTF8', function(err, content){
        if(err){
          sendResponse(res, null, 406);
          console.log("37: Are we here");
          throw err;
        } else {
          sendResponse(res, content, 200);
        }
      });
    } else {
      sendResponse(res, null, 404);
      console.log("51: Are we here");
    }
  }
  // res.end(archive.paths.list);
};
