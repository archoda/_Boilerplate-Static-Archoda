'use strict';

const gulp              = require('gulp');                /* https://gulpjs.com/docs/en/getting-started/using-plugins */
const gls               = require('gulp-live-server');    /* https://www.npmjs.com/package/gulp-live-server */
const sass              = require('gulp-sass');           /* https://www.npmjs.com/package/gulp-sass */
const cleanCSS          = require('gulp-clean-css');      /* https://www.npmjs.com/package/gulp-clean-css */
const concat            = require('gulp-concat');         /* https://www.npmjs.com/package/gulp-concat */
const terser            = require('gulp-terser');         /* https://www.npmjs.com/package/gulp-terser */
var sourcemaps          = require('gulp-sourcemaps');     /* https://www.npmjs.com/package/gulp-sourcemaps */

// const del               = require('del');                 /* https://www.npmjs.com/package/del */


sass.compiler = require('node-sass');


function htmlcompile() {
    return gulp.src(['./static/**/*.html', '!node_modules/**/*.html'])
      .pipe(gulp.dest('./dist'));
};

function sasscompile() {
    return gulp.src('./static/lib/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./static/lib/sass/css'));
};

function cssconcat()
{
    return gulp.src('./static/lib/sass/css/*.css')
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./dist/lib/css'));
}

function cssuglify()
{
    return gulp.src('./dist/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css'));

}

function jsconcat()
{
    return gulp.src('./static/lib/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/lib/js'));
}

function serveprod()
{
    //1. serve with default settings
    var server = gls.static(); //equals to gls.static('public', 3000);
    server.start();
 
    //2. serve at custom port
    var server = gls.static('dist', 8090);
    server.start();
 
    //3. serve multi folders
    var server = gls.static(['dist', '.tmp']);
    server.start();
};

function defaultTask(cb) {
    // place code for your default task here
    
    console.log('Gulp Move Static HTML');
    htmlcompile();

    console.log('Gulp Compile SASS to CSS');
    sasscompile();

    console.log('Gulp Minify CSS');
    cssuglify();

    console.log('Gulp Bundle CSS');
    cssconcat();

    console.log('Gulp Bundle & Minify JS');
    jsconcat();
    
    serveprod();

    cb();
}

// exports.default = function() {
 
//     parallel(sasscompile);

//     // watch('./static/lib/sass/**/*.scss', ['sasscompile']);
//     // watch('./dist/css', ['minifycss']);
// }

exports.default = defaultTask;