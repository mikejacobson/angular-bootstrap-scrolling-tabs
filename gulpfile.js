var gulp = require('gulp');

var browserSync = require('browser-sync');
var cleancss = require('gulp-clean-css');
var fs = require('fs');
var header = require('gulp-header');
var include = require('gulp-include');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');

var headerFilePath = 'src/js/header.js';

gulp.task('browser-sync', function () {
  return browserSync.init({
    startPath: 'run',
    server: {
      baseDir: './'
    },
    port: 3000,
    ghostMode: false
  });
});

gulp.task('browser-sync:nobrowser', function () {
  return browserSync.init({
    startPath: 'run',
    server: {
      baseDir: './'
    },
    open: false,
    port: 3000
  });
});

gulp.task('bundlejs', function () {
  return gulp.src('src/js/_main.js')
    .pipe(include())
      .on('error', console.log)
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(rename('scrolling-tabs.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint:dist', function () {
  return gulp.src('dist/scrolling-tabs.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint:src', function () {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('mincss', function () {
  return gulp.src('dist/scrolling-tabs.css')
    .pipe(rename('scrolling-tabs.min.css'))
    .pipe(cleancss())
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('minjs', function () {
  return gulp.src('dist/scrolling-tabs.js')
    .pipe(rename('scrolling-tabs.min.js'))
    .pipe(uglify())
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(header(fs.readFileSync(headerFilePath, 'utf8')))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch:src', function () {
  gulp.watch('src/scss/*.scss', ['build']);
  gulp.watch('src/js/*.js', ['build']);
});

gulp.task('watch:dist', function () {
  gulp.watch(['dist/*.*', 'test/*.html']).on('change', browserSync.reload);
});


gulp.task('build', function (cb) {
  runSequence('lint:src',
              'bundlejs',
              'lint:dist',
              'minjs',
              'sass',
              'mincss',
              cb);
});

gulp.task('serve', function (cb) {
  runSequence('build',
              'browser-sync',
              cb);
});

gulp.task('protractor', function (cb) {
  gulp.src('', { read: false })
    .pipe(shell([
      './node_modules/protractor/bin/protractor protractor.config.js'
    ], {}))
    .on('end', function () {
      console.log('e2e tests completed');
      process.exit(0);
    });
});

gulp.task('e2e', function () {
  runSequence('build',
              'browser-sync:nobrowser',
              'protractor');
});

gulp.task('default', function () {
  runSequence('serve',
              'watch:src');
});
