var gulp      = require('gulp');
var gulpJade  = require('gulp-jade');
var jade      = require('jade');
var imagemin  = require('gulp-imagemin');
var pngquant  = require('imagemin-pngquant');
var uglify    = require('gulp-uglify');
var gulpif    = require('gulp-if');
var outputDir = 'build';
var buildType = process.env.buildtype || 'development';

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
        .pipe(gulp.dest(outputDir));
});

gulp.task('cloneStatic', function() {
  return gulp.src('./static/**/*')
        .pipe(gulp.dest(outputDir + '/static'));
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
        .pipe(gulp.dest(outputDir + '/static/img'));
});

gulp.task('js', function() {
  return gulp.src('./app/js/**/*.js')
        .pipe(gulpif(buildType === 'production', uglify()))
        .pipe(gulp.dest(outputDir + '/static/js'));
});

// gulp.task('cloneJs', function() {
//   return gulp.src('./app/js/third_party/**/*')
//         .pipe(gulp.dest(outputDir + '/static/js/third_party/'));
// });

gulp.task('watch', function() {
  gulp.watch('./app/views/**/*.jade', ['html']);
  gulp.watch('./app/js/**/*.js', ['js']);
});

gulp.task('default', ['html', 'images', 'js', 'cloneStatic', 'watch']);
