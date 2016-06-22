const   gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    babel           = require('gulp-babel'),
    plumber         = require('gulp-plumber'),
    es2015          = require('babel-preset-es2015'),
    browserify      = require('browserify'),
    source          = require('vinyl-source-stream'),
    babelify        = require('babelify'),
    browserSync     = require('browser-sync');

const   srcDir        = '../src',
    distDir       = '../',
    scripts       = [srcDir + '/js/scripts.js'],
    styles        = [srcDir + '/sass/main.scss'];

//Gulp compile styles
gulp.task('styles', function () {
    return gulp.src(styles)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(gulp.dest(distDir+'/css'))
        .pipe(browserSync.stream());
});

//Gulp compile scripts
gulp.task('scripts', function () {
    return browserify(scripts)
        .transform('babelify', {presets: [es2015]})
        .bundle()
        .pipe(source('scripts.js'))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest(distDir+'/js'))
});

//Watch task
gulp.task('watch',function() {
    browserSync.init({
        server: distDir
    });
    gulp.watch([srcDir+'/sass/*.scss', srcDir+'/js/scripts.js'], ['styles', 'scripts']);
});