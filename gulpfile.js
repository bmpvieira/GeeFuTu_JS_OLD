// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jsdoc = require('gulp-jsdoc');
var rename = require("gulp-rename");


// Lint Task
gulp.task('lint', function () {
    return gulp.src('public/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// cp config-example.json -> config.json
gulp.task('config-file', function () {
    return gulp.src("./config-example.json")
        .pipe(rename("./config.json"))
        .pipe(gulp.dest("./")); // ./dist/main/text/ciao/goodbye.md
});

// Compile Our Sass
gulp.task('sass', function () {
    return gulp.src('public/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('public/js/*.js', ['lint', 'scripts']);
    gulp.watch('public/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass']);
