var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('run', function () {
  nodemon({ script: 'server.js', ext: 'js', ignore: ['public/**', 'node_modules/**'] })
    .on('restart', function () {
      console.log('Server Restarted');
    });
});

gulp.task('default', ['run']);
