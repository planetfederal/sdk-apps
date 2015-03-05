var http      = require('http'),  
    httpProxy = require('http-proxy'),
    staticServer = require('node-static');

var PORT = 8001;
var GEOSERVER_PATH = 'http://localhost:8080';

var proxy = httpProxy.createProxy();
var file = new staticServer.Server('./');

var proxyServer = http.createServer(function(req, res) {
  if (req.url.indexOf('/geoserver') === 0) {
    proxy.web(req, res, {
      target: GEOSERVER_PATH
    });
  } else {
    console.log('Request: ', req.url);
    if (req.url.indexOf('ol.js')) {
      console.log('serve debug');
      res.setHeader('X-SourceMap', '/node_modules/openlayers/build/ol.js.map');
      req.url = req.url.replace('ol.js', 'ol-debug.js');
    }
    file.serve(req, res);
  }
}).listen(PORT);

console.log("Serving on localhost:" + PORT);

