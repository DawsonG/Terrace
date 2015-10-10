var browserify = require('browserify'),
  gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  streamify = require('streamify'),
  buffer = require('vinyl-buffer'),
//  buffer = require('vinyl-buffer'),
//  gutil = require('gulp-util'),
  uglify = require('gulp-uglify'),
//  sourcemaps = require('gulp-sourcemaps'),
  reactify = require('reactify');


var path = {
  HTML: 'admin/src/index.html',
  ENTRY: 'admin/src/js/application.jsx',
  JS: ['admin/src/js/*.jsx', 'admin/src/js/**/*.jsx'],
  MINIFIED_OUT: 'js/bundle.min.js',
  DEST_SRC: 'admin/dist/src',
  DEST_BUILD: 'admin/dist/build',
  DEST: 'admin/dist'
};

gulp.task('build', function() {
  gulp.src(path.HTML).pipe(gulp.dest(path.DEST));
  
  var b = browserify({
    entries: path.ENTRY, // Only need initial file, browserify finds the dependencies
    transform: [reactify], // We want to convert JSX to normal javascript
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  return b.bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(path.DEST));
});

/*
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('watch', function() {
  gulp.watch(path.HTML, ['copy']);

  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC));

      console.log('Updated');
  })
  .bundle()
  .pipe(source(path.OUT))
  .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ['./admin/src/application.jsx'], // Only need initial file, browserify finds the deps
    transform: [reactify], // We want to convert JSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  var watcher  = watchify(bundler);

  return watcher.on('update', function () { // When any files update
    var updateStart = Date.now();
    console.log('Updating!');
    
    watcher.bundle() // Create new bundle that uses the cache for high performance
      .pipe(source('application.jsx'))
      .pipe(gulp.dest('./build/'));
      
      console.log('Updated!', (Date.now() - updateStart) + 'ms');
  })
  .bundle() // Create the initial bundle when starting the task
  .pipe(source('application.jsx'))
  .pipe(gulp.dest('./build/'));
});

gulp.task('build', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));

  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
  .bundle()
  .pipe(source(path.MINIFIED_OUT))
  .pipe(streamify(uglify(path.MINIFIED_OUT)))
  .pipe(gulp.dest(path.DEST_BUILD));
});

*/

gulp.task('production', ['replaceHTML', 'build']);

gulp.task('default', ['build']);