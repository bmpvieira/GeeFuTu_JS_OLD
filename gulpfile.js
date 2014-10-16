// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-sass');
var rename = require("gulp-rename");


// cp config-example.json -> config.json
gulp.task('config-file', function () {
    return gulp.src("./config-example.json")
        .pipe(rename("./config.json"))
        .pipe(gulp.dest("./"));
});

// Compile Our Sass
gulp.task('sass', function () {
    return gulp.src('public/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('public/scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint']);
