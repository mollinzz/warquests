var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync'); 
// var jsdoc = require("gulp-jsdoc");	

gulp.task('sass', function(){
	return gulp.src('app/sass/style.sass')
	.pipe(sass())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: 
		true}))
});

gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir: 'app',
			index: 'index3.html'
		},
		notify: true
	})
});

// gulp.task('docs', function(){
// 	gulp.src("app/js/*.js")
// 	.pipe(jsdoc('docs/'))	
// });

gulp.task('watch',['browser-sync','sass'],function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
});

gulp.task('dev',['browser-sync'] ,function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/js/**/*.js', browserSync.reload);
	gulp.watch('app/**/*.html', browserSync.reload);
    //gulp.jsdoc()
})
