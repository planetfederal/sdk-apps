var browserify = require('browserify');
var watchify = require('watchify');
var through = require('through');
var fs = require('fs');
var path = require('path');
var cp = require('child_process');

function globalOl(file) {
  var data = '';
  function write(buf) { data += buf; }
  function end() {
    this.queue(data.replace("import ol from 'openlayers'", "var ol = window.ol;"));
    this.queue(null);
  }
  return through(write, end);
}

var b = browserify({
  entries: ['./app.jsx'],
  debug: true,
  plugin: [watchify],
  cache: {},
  packageCache: {}
}).transform(globalOl);

var outFile = './build/app-debug.js';

b.on('update', function bundle(onError) {
  var stream = b.bundle();
  if (onError) {
    stream.on('error', function(err) {
      console.log(err.message);
      process.exit(1);
    });
  }
  stream.pipe(fs.createWriteStream(outFile));
});

b.bundle(function(err, buf) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  } else {
    fs.writeFile(outFile, buf, 'utf-8');
    cp.fork(path.join(path.dirname(require.resolve('openlayers')),
        '../tasks/serve-lib.js'), []);
  }
});
