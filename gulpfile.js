var gulp       = require('gulp');
var gulpJade   = require('gulp-jade');
var jade       = require('jade');
var imagemin   = require('gulp-imagemin');
var pngquant   = require('imagemin-pngquant');
var uglify     = require('gulp-uglify');
var gulpif     = require('gulp-if');
var minifyCss  = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var connect    = require('gulp-connect');
var outputDir  = 'build';
var buildType  = process.env.buildtype || 'development';

gulp.task('html', function() {
  var config = {
    jade: jade
  };

  if (buildType === 'production') {
    config.pretty = false;
  } else {
    config.pretty = true;
  }

  return gulp.src('./app/views/index.jade')
        .pipe(gulpJade(config))
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});


gulp.task('images', function() {
  return gulp.src('./app/images/**/*')
        .pipe(imagemin({
          progressive: true,
          multipass: true,
          optimizationLevel: 3,
          use: [pngquant()],
          svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest(outputDir + '/static/img'))
        .pipe(connect.reload());
});

gulp.task('js', function() {
  return gulp.src('./app/js/**/*.js')
        .pipe(gulpif(buildType === 'production', uglify()))
        .pipe(gulp.dest(outputDir + '/static/js'))
        .pipe(connect.reload());
});

gulp.task('css', function() {
  return gulp.src('./app/css/**/*.css')
        .pipe(gulpif(buildType === 'development', sourcemaps.init()))
        .pipe(gulpif(buildType === 'production', minifyCss()))
        .pipe(gulpif(buildType === 'development', sourcemaps.write()))
        .pipe(gulp.dest(outputDir + '/static/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('./app/views/**/*.jade', ['html']);
  gulp.watch('./app/js/**/*.js', ['js']);
  gulp.watch('./app/css/**/*', ['css']);
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
}) ;

gulp.task('default', ['html', 'images', 'js', 'connect', 'css', 'watch']);
