var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var Server = require('karma').Server;

function compile(src) {
  return gulp.src(src)
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-umd']
    }))
  .pipe(gulp.dest('compiled'));
}

gulp.task('default', ['clean', 'compile', 'test', 'dist']);

gulp.task('compile', ['compile-src', 'compile-specs']);

gulp.task('compile-src', function() {
  return compile(['src/*.js'])
    .pipe(gulp.dest('.'));
});

gulp.task('compile-specs', function() {
  return compile(['spec/*.js']);
});

gulp.task('clean', function () {
  return gulp.src(['compiled/*.js', './coroutine.js'], {read: false})
    .pipe(clean());
});

gulp.task('dist', ['compile-src'], function() {
  return gulp.src('compiled/coroutine.js')
    .pipe(uglify())
    .pipe(rename('coroutine.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('test', ['compile'], function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJS'],
    singleRun: true
  }, done).start();
});