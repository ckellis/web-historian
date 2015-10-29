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
  response.end(data);
};

exports.handleRequest = function (req, res) {
  //console.log("6: handleRequest:", req);
  if(req.method === "GET") {
    var parts = url.parse(req.url);
    var route = parts.pathname;

    if(route === '/') {
      var filePath = archive.paths.siteAssets + router[route];
      console.log("34", filePath);
      fs.readFile(filePath, 'UTF8', function(err, content){
        if(err){
          sendResponse(res, null, 406);
          throw err;
        } else {
          sendResponse(res, content, 200);
        }
      });
    } else {
      sendResponse(res, null, 404); 
    }
  } else if(req.method === "POST") {
    //POST
    console.log("POST");

    var data = '';
    req.on('data', function(chunk) {
         data += chunk;
      });
    req.on('end',function(){
      // console.log("54", archive.paths.list); 
      data = data.substr(4) + ',';
      archive.isUrlInList(data);
      if(archive.isUrlInList(data)){
        console.log("58");
        fs.appendFile(archive.paths.list, data, function(err) {
          if(err){
            sendResponse(res, null, 400);
          } else {
            sendResponse(res, null, 200);
          }
        });
      }
    });
  }
  // res.end(archive.paths.list);
};
