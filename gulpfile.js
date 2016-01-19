var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var Server = require('karma').Server;

gulp.task('default', ['clean', 'compile', 'test']);

gulp.task('compile', function() {
  return gulp.src(['src/*.js', 'spec/*.js'])
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-umd']
    }))
  .pipe(gulp.dest('compiled'));
});

gulp.task('clean', function () {
  return gulp.src('compiled/*.js', {read: false})
    .pipe(clean());
});

gulp.task('test', ['compile'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'],
    singleRun: true
  }, done).start();
});