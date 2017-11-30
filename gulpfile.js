var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var webpack = require('webpack');
var browserSync = require('browser-sync').create();

gulp.task('clean',function () {
  return gulp.src('dist')
    .pipe(plugins.clean({
      force:true
    }))
})

gulp.task('fileinclude', function() {
  return gulp.src(['./src/views/**/*.html'])
    .pipe(plugins.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(plugins.minifyHtml())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scss',function(){
  return gulp.src(['./src/views/**/*.scss'])
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(plugins.minifyCss())
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('dist'))
})

gulp.task('webpack',function(callback){
  var webpackConfig = require('./webpack.config');
  webpack(webpackConfig, function (err, stats) {
    console.log(stats.toString());
    if (err) throw new gutil.PluginError("webpack", err);
    plugins.util.log("[webpack]", stats.toString({
      colors: true,
      chunks: false,
      children: false,
    }));
    callback();
  })
})

gulp.task('minify-img',function () {
  return gulp.src('./src/public/images/*.{png,jpg,jpeg,gif,ico}',{base:'src'})
    .pipe(plugins.imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(plugins.rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(gulp.dest('dist'))
})

gulp.task('js',['webpack'],function () {
  return gulp.src('./src/views/**/bundle.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({stream:true}))
})

gulp.task('copy',function () {
  return gulp.src(['./src/public/**','!./src/public/images/**'],{base:'src'})
    .pipe(gulp.dest('dist'))
})

gulp.task('watch',function () {
  gulp.watch('./src/**/*.html', ['fileinclude']);
  gulp.watch('./src/**/*.scss', ['scss']);
  gulp.watch('./src/public/images/**', ['minify-img']);
  gulp.watch('./src/views/**/*.js', ['js']);
  console.log('html,js,scss,img发生了改动');
})

gulp.task('server', function(){
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    startPath: "/example"
  });
  gulp.start('watch');
  console.log('browser-sync服务启动成功')
});



gulp.task('prod',['clean'],function () {
  gulp.start('fileinclude');
  gulp.start('scss');
  gulp.start('copy');
  gulp.start('minify-img');
  gulp.start('js');
})

gulp.task('default',['prod','server']);