var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var Server = require('karma').Server;

gulp.task('default', ['clean', 'compile', 'test', 'dist']);

gulp.task('compile', function() {
  return gulp.src(['src/*.js', 'spec/*.js'])
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-umd']
    }))
  .pipe(gulp.dest('compiled'));
});

gulp.task('clean', function () {
  return gulp.src(['compiled/*.js', 'dist/*.js'], {read: false})
    .pipe(clean());
});

gulp.task('dist', ['compile'], function() {
  return gulp.src('compiled/coroutine.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', ['compile'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'],
    singleRun: true
  }, done).start();
});