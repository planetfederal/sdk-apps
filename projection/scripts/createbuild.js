var fs = require('fs-extra');

var dir = 'build';
fs.ensureDir(dir, function (err) {
  if (err) {
    console.log(err);
  }
});
