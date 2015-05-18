var gulp = require('gulp'),

    browserSync = require('browser-sync').create(), //web服务器 

  	jshint = require('gulp-jshint'), //js检查  https://www.npmjs.com/package/gulp-jshint

  	sass = require('gulp-ruby-sass'), //sass编译

  	sourcemaps = require('gulp-sourcemaps'),//sass调试map图

  	autoprefixer = require('gulp-autoprefixer'), //css加浏览器版本前缀

  	imagemin = require('gulp-imagemin'), //图片压缩

  	pngquant = require('imagemin-pngquant'), //图片压缩 

  	rename = require('gulp-rename'), //更改名字  https://www.npmjs.com/package/gulp-rename

  	concat = require('gulp-concat'),  //合并文件 https://www.npmjs.com/package/gulp-concat

  	clean = require('gulp-clean'), //清空文件夹  https://www.npmjs.com/package/gulp-clean

  	gulpif = require('gulp-if'),  //gulp if

  	sprite = require('css-sprite').stream, //css雪碧图  https://www.npmjs.com/package/css-sprite

    jade = require('jade'),

    gulpJade = require('gulp-jade'),

    //katex = require('katex'),
    
    data = require('gulp-data'),

    path = require('path'),

    reload = browserSync.reload;


//启动webServer
gulp.task('serve', ['jade','sass', 'html', 'sprites', 'picmin', 'js'], function() {

    browserSync.init({
        server: "./web"
    });
    gulp.watch("web/src/tpl/*.jade", ['jade']);
    gulp.watch("web/src/scss/*.scss", ['sass']);
    gulp.watch("web/src/images/sprite/*", ['sprites']);
    gulp.watch("web/src/images/*", ['picmin']);
    //gulp.watch("web/src/*.html", ['html']);
    gulp.watch("web/src/js/*.js", ['js']);
    gulp.watch("web/dist/*.html").on('change', reload);
    gulp.watch("web/dist/css/*.css").on('change', reload);
    gulp.watch("web/dist/js/*.js").on('change', reload);
});
//另存html页面
gulp.task('html', function () {
  return gulp.src('./web/src/*.html')
    .pipe(gulp.dest('./web/dist/'));
});
//编译SASS
gulp.task('sass', function() {
    return sass('./web/src/scss/', { sourcemap: true, style: 'expanded' })
    .pipe(sourcemaps.write())  //sass 调试Map
    .pipe(autoprefixer({
           browsers: ['last 2 versions'],
           cascade: false
    }))
    //.pipe(concat('all.css'))  //样式合并
    .pipe(gulp.dest('./web/dist/css/'))
});

//css雪碧图
gulp.task('sprites', function () {

  return gulp.src('./web/src/images/sprite/*.png')

    .pipe(sprite({
      name: 'sprite',
      style: '_sprite.scss',
      cssPath: '../images/sprite/',
      processor: 'scss'
    }))
    
    .pipe(gulpif('*.png', gulp.dest('./web/dist/images/sprite/'), gulp.dest('./web/src/scss/')));
});

//图标压缩
gulp.task('picmin', function(){

  return gulp.src('./web/src/images/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        //use: [pngquant()]
    }))
    .pipe(gulp.dest('./web/dist/images'));
});

//js验证
gulp.task('js', function(){
	return gulp.src('./web/src/js/*.js')
			   .pipe(jshint())
			   .pipe(jshint.reporter('default'))
			   .pipe(gulp.dest('./web/dist/js/'));
});

//jade编译
//jade.filters.katex = katex.renderToString;
//jade.filters.shoutFilter = function (str) {
//  return str + '!!!!';
//}
gulp.task('jade', function () {
  return gulp.src('./web/src/tpl/*.jade')
    .pipe(data(function(file) {
      return require('./web/src/data/' + path.basename(file.path) + '.json');
    }))
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('./web/dist/'))
})

//清空文件夹 
gulp.task('clean', function(){
	return gulp.src(['./web/dist/css', './web/dist/js', './web/dist/images', './web/dist/*.html'], {read: false})
		.pipe(clean());
});


gulp.task('default', ['serve']);

