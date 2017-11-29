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
    .pipe(browserSync.stream())
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
    .pipe(browserSync.stream())
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

gulp.task('js',['webpack'],function () {
  return gulp.src('./src/views/**/bundle.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
    .pipe(browserSync.reload({stream:true}))
})

gulp.task('copy',function () {
  return gulp.src('./src/static/**',{base:'src'})
    .pipe(gulp.dest('dist'))
})

gulp.task('watch',function () {
  gulp.watch('./src/**/*.html', ['fileinclude']);
  gulp.watch('./src/**/*.scss', ['scss']);
  gulp.watch('./src/views/**/*.js', ['js']);
  console.log('html,js,scss发生了改动');
})

gulp.task('server', function(){
  browserSync.init({
    server: {
      baseDir: "./dist"
    },
    startPath: "/demo"
  });
  gulp.start('watch');
  console.log('browser-sync服务启动成功')
});



gulp.task('prod',['clean'],function () {
  gulp.start('fileinclude');
  gulp.start('scss');
  gulp.start('copy');
  gulp.start('js');
})

gulp.task('default',['prod','server']);