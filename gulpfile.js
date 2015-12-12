var gulp      = require('gulp');
var gulpJade  = require('gulp-jade');
var jade      = require('jade');
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

gulp.task('watch', function() {
  gulp.watch('./app/views/**/*.jade', ['html']);
});

gulp.task('default', ['html', 'cloneStatic', 'watch']);
