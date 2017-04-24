var tools = require('@boundlessgeo/sdk-tools');
process.argv.slice(2).forEach(function (arg) {
  var flag = arg.split('=')[0];
  if (flag == '--output-file') {
    tools.createPackage(arg.split('=')[1]);
  }
});
