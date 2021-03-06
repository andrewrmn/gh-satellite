// Project Specific Variables
const projectPath 		= './';
const devPath 			= projectPath + '_dev';
const buildPath 		= projectPath + 'assets';
const projectURL 		= 'http://local.satellite';

// Global Gulp Dependency
const gulp 				= require('gulp');
const gulpLoadPlugins 	= require('gulp-load-plugins');
const rename			= require('gulp-rename');
const newer				= require('gulp-newer');
const path 				= require('path');
const webpack 			= require('webpack-stream');

// Styles Task Dependencies
const sass 				= require('gulp-sass');
const pixrem 			= require('gulp-pixrem');
const autoprefixer		= require('gulp-autoprefixer');
const cleanCSS 			= require('gulp-clean-css');

// Scripts Task Dependencies
const concat 			= require('gulp-concat');
const uglify			= require('gulp-uglify');


// Images Task Dependencies
const imagemin			= require('gulp-imagemin');
const pngquant			= require('imagemin-pngquant');

// SVG Task Dependencies
const svgstore			= require('gulp-svgstore');
const svgmin			= require('gulp-svgmin');
const cheerio 			= require('gulp-cheerio');

const $ = gulpLoadPlugins();

// Server Task Dependencies
const browserSync		= require('browser-sync').create();
const reload = browserSync.reload;

// Styles Gulp task, run by calling 'gulp styles' in CLI
gulp.task('styles', function() {
	gulp.src([devPath + '/css/satellite-index.scss'])
	.pipe(rename({ basename: "main" }))
	.pipe(sass().on('error', sass.logError))
	//.pipe(pixrem({ rootValue: '62.5%' }))
	.pipe(autoprefixer({ browsers: ['last 2 versions', 'ie 8', 'ie 9'] }))
	//.pipe(gulp.dest(buildPath + '/css/'))
	.pipe(cleanCSS())
	.pipe(gulp.dest(buildPath + '/css/satellite/'))
});

// Scripts Gulp task, run by calling 'gulp scripts' in CLI
gulp.task('scripts', function() {
	var scriptsToConcat = [
		devPath + '/js/satellite/main.js'
	];
	gulp.src(scriptsToConcat)
		.pipe(concat('main.js'))
		//.pipe(gulp.dest(buildPath + '/js/'))
		.pipe(uglify())
		.pipe(gulp.dest(buildPath + '/js/satellite/'))
});

// Move scripts
gulp.task('moveScripts', function () {
  return gulp.src([devPath + '/js/satellite/**.*'])
    .pipe( gulp.dest(buildPath + '/js/satellite/') );
});

// Move fonts
gulp.task('fonts', function () {
	return gulp.src([devPath + '/fonts/satellite/**/*'])
      .pipe( gulp.dest(buildPath + '/fonts/satellite/') );
});


// Images Gulp task, run by calling 'gulp images' in CLI
gulp.task('images', function() {
	gulp.src([devPath + '/img/**/*.{png,jpg,gif,ico,svg}'])
	.pipe(newer(buildPath + '/img/satellite'))
	.pipe(imagemin({
		progressive: true,
		use: [pngquant()]
	}))
	.pipe(gulp.dest(buildPath + '/img/'))
});

// Watch Gulp task, run by calling 'gulp watch' in CLI
gulp.task('watch', function() {
	gulp.watch(devPath + '/css/satellite/**/*.scss', ['styles']);
	gulp.watch(devPath + '/js/satellite/main.js', ['scripts']);
});

// Server Gulp task, run by calling 'gulp server' in CLI
gulp.task('server', function() {
	browserSync.init({
		open: false,
		injectChanges: true,
		proxy: projectURL,
		files: [buildPath + '/css/satellite/*.css', buildPath + '/js/satellite/*.js']
	})
	gulp.watch(projectPath + '**/*.php').on('change', browserSync.reload);
});

// Default Gulp task, run by calling 'gulp' in CLI
gulp.task('default', ['styles', 'scripts', 'moveScripts', 'fonts', 'images', 'watch', 'server'])
