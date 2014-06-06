var debug = require('debug')('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglifyjs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
  var bundleStream = browserify('./client/index.js', { debug: true }).bundle();

  bundleStream
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public/build/'))
    .pipe(streamify(uglify()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./public/build/'));
});

gulp.task('watch', function() {
  var bundler = watchify('./client/index.js');
  bundler.on('update', rebundle);
  function rebundle () {
    debug('updating bundle', arguments);
    return bundler.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./public/build/'))
      .pipe(streamify(uglify()))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./public/build/'));
  }

  return rebundle();
});