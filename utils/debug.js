/**
 * Starts a debug server and proxy for /geoserver requests
 * Arguments
 *   --port  Port to start debug server on. Defaults to 8001
 *   --proxy Host which to proxy /geoserver requests to.
 *           Defaults to http://localhost:8080
 */

var http = require('http'),
    httpProxy = require('http-proxy'),
    staticServer = require('node-static'),
    argv = require('minimist')(process.argv);

var PORT = argv.port || 8001;
var GEOSERVER_PATH = argv.proxy || 'http://localhost:8080';

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
}).listen(PORT);

console.log('Proxying /geoserver requests to ' + GEOSERVER_PATH);
console.log("Serving on localhost:" + PORT);
