var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect'),
	jade = require('jade'),
	gulpJade = require('gulp-jade'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	data = require('gulp-data'),
	fs = require('fs'),
	path = require('path');

gulp.task('sass', function(){
	return gulp.src('src/scss/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true,
			remove: true
		}))
		.pipe(gulp.dest('build/css'))
		.pipe(connect.reload());
});

gulp.task('connect', function(){
	connect.server({
		port: 3000,
		livereload: true
	});
});

gulp.task('jade', function(){
	return gulp.src('src/jade/*.jade')
		.pipe(plumber())
		.pipe(data(function(file) {
			return JSON.parse(fs.readFileSync('data/data.json'));
		}))
		.pipe(gulpJade({
			jade: jade,
			pretty: true
		}))
		.pipe(gulp.dest('build/html'))
		.pipe(connect.reload());
});

gulp.task('compress', function(){
	return gulp.src('src/js/*.js')
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest('build/js'))
		.pipe(connect.reload());
});

gulp.task('watch', function(){
	gulp.watch('src/jade/**.jade', ['jade','sass']);
	gulp.watch('src/scss/**.scss', ['sass']);
	gulp.watch('src/js/**.js', ['compress']);
});

gulp.task('default', ['sass', 'jade', 'compress', 'connect', 'watch']);