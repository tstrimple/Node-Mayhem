var browserify = require('browserify');
var path = require('path');
var fs = require('fs');
var UglifyJS = require('uglify-js');
var source = path.join(__dirname, '../src/app.js');
var fat = path.join(__dirname, '../public/build/app.js');
var thin = path.join(__dirname, '../public/build/app.min.js');
var pointerEvents = path.join(__dirname, '../public/lib/pointerevents.min.js');

browserify(source).bundle({}, function(err, src) {
  if(err) {
    return console.error(err);
  }
  fs.writeFileSync(fat, src);
  console.log(fat);
  var result = UglifyJS.minify([pointerEvents, fat], { compress: true, mangle: true });
  fs.writeFileSync(thin, result.code);
});
