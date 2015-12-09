var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var stream = require('vinyl-source-stream');
var connect = require('gulp-connect');
var minifyhtml = require('gulp-minify-html');

var env = process.env.NODE_ENV || 'development';
var outputDir = 'build';

gulp.task('css', function () {
  var config = {};

  if(env === 'production') {
    config.outputStyle = 'compressed';
  }

  return gulp.src('./app/sass/main.sass')
        .pipe(gulpif(env === 'development', sourcemaps.init()))
        .pipe(sass(config))
        .pipe(gulpif(env === 'development', sourcemaps.write()))
        .pipe(gulp.dest(outputDir + '/css'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
  return browserify('./app/js/main.js', { debug: env === 'development' })
        .bundle()
        .pipe(stream('bundle.js'))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
  return gulp.src('./app/views/**/*.html')
        .pipe(minifyhtml())
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});

gulp.task('connect', function () {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch('./app/sass/**/*.sass', ['css']);
  gulp.watch('./app/js/**/*.js', ['js']);
  gulp.watch('./app/views/**/*.html', ['html']);
});

gulp.task('default', ['css', 'js', 'connect', 'watch', 'html']);
