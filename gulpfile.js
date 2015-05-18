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

    jade = require('jade'),   //jade

    gulpJade = require('gulp-jade'), //gulp-jade

    //katex = require('katex'),
    
    data = require('gulp-data'), //gulp-data

    path = require('path'),

    reload = browserSync.reload,

    dir = "web",

    markDir = "./web";




//启动webServer
gulp.task('serve', ['jade','sass', 'html', 'sprites', 'picmin', 'js'], function() {

    browserSync.init({
        server: markDir
    });
    gulp.watch(dir+"/src/tpl/*.jade", ['jade']);
    gulp.watch(dir+"/src/scss/*.scss", ['sass']);
    gulp.watch(dir+"/src/images/sprite/*", ['sprites']);
    gulp.watch(dir+"/src/images/*", ['picmin']);
    //gulp.watch("web/src/*.html", ['html']);
    gulp.watch(dir+"/src/js/*.js", ['js']);
    gulp.watch(dir+"/dist/*.html").on('change', reload);
    gulp.watch(dir+"/dist/css/*.css").on('change', reload);
    gulp.watch(dir+"/dist/js/*.js").on('change', reload);
});
//另存html页面
gulp.task('html', function () {
  return gulp.src(markDir+'/src/*.html')
    .pipe(gulp.dest(markDir+'/dist/'));
});
//编译SASS
gulp.task('sass', function() {
    return sass(markDir+'/src/scss/', { sourcemap: true, style: 'expanded' })
    .pipe(sourcemaps.write())  //sass 调试Map
    .pipe(autoprefixer({
           browsers: ['last 2 versions'],
           cascade: false
    }))
    //.pipe(concat('all.css'))  //样式合并
    .pipe(gulp.dest(markDir+'/dist/css/'))
});

//css雪碧图
gulp.task('sprites', function () {

  return gulp.src(markDir+'/src/images/sprite/*.png')

    .pipe(sprite({
      name: 'sprite',
      style: '_sprite.scss',
      cssPath: '../images/sprite/',
      processor: 'scss'
    }))
    
    .pipe(gulpif('*.png', gulp.dest(markDir+'/dist/images/sprite/'), gulp.dest(markDir+'/src/scss/')));
});

//图标压缩
gulp.task('picmin', function(){

  return gulp.src(markDir+'/src/images/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        //use: [pngquant()]
    }))
    .pipe(gulp.dest(markDir+'/dist/images'));
});

//js验证
gulp.task('js', function(){
	return gulp.src(markDir+'/src/js/*.js')
			   .pipe(jshint())
			   .pipe(jshint.reporter('default'))
			   .pipe(gulp.dest(markDir+'/dist/js/'));
});

//jade编译
//jade.filters.katex = katex.renderToString;
//jade.filters.shoutFilter = function (str) {
//  return str + '!!!!';
//}
gulp.task('jade', function () {
  return gulp.src(markDir+'/src/tpl/*.jade')
    .pipe(data(function(file) {
      return require(markDir+'/src/data/' + path.basename(file.path) + '.json');
    }))
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest(markDir+'/dist/'))
})

//清空文件夹 
gulp.task('clean', function(){
	return gulp.src([markDir+'/dist/css', markDir+'/dist/js', markDir+'/dist/images', markDir+'/dist/*.html'], {read: false})
		.pipe(clean());
});


gulp.task('default', ['serve']);

