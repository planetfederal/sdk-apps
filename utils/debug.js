var http      = require('http'),  
    httpProxy = require('http-proxy'),
    staticServer = require('node-static');

var GEOSERVER_PATH = 'http://localhost:8080';

var proxy = httpProxy.createProxy();
var file = new staticServer.Server('./');

var proxyServer = http.createServer(function(req, res) {
  if (req.url.indexOf('/geoserver') === 0) {
    proxy.web(req, res, {
      target: GEOSERVER_PATH
    });
  } else {
    file.serve(req, res);
  }
}).listen(8001);
