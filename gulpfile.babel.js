import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const plugins = gulpLoadPlugins();

const paths = {
    js: ['./**/*.js', '!dist/**', '!node_modules/**'],
    nonJs: ['./package.json', './.gitignore']
};

gulp.task('babel', () =>
    gulp.src([...paths.js, '!gulpfile.babel.js'], {base: '.'})
        .pipe(plugins.newer('dist'))
        .pipe(plugins.babel())
        .pipe(gulp.dest('dist'))
);

gulp.task('serve', ['babel'],() => {
});