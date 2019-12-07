const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync');
const { series } = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

function imageMinify() {
  return gulp
    .src('src/img/**/*.{png,jpg,svg}')
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
        }),
        imagemin.jpegtran({
          progressive: true,
        }),
        imagemin.optipng({
          optimizationLevel: 3,
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: true,
            },
            {
              cleanupIDs: false,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest('docs/img'));
}

function copyToDocs() {
  return gulp
    .src(
      [
        'src/fonts/**/*.{woff,woff2}',
        'src/js/**/*.js',
        'src/pages/*.html',
        'src/*.html',
        'src/css/*.css',
        'src/css/*.min.css',
      ],
      {
        base: 'src',
      }
    )
    .pipe(gulp.dest('docs'));
}

function cssMinify() {
  return gulp
    .src('src/sass/**/*.scss')
    .pipe(sass())
    .pipe(postcss([autoprefixer(['last 2 versions'])]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

function watchFunc() {
  browserSync.init({
    server: {
      baseDir: './src',
    },
  });

  gulp.watch('./src/sass/**/*.scss', sassFunc);
  gulp.watch('./src/js/**/*.js').on('change', browserSync.reload);
  gulp.watch('./src/**/*.html').on('change', browserSync.reload);
}

function cleanUp() {
  return del('docs');
}

// Создает в папке src css файл который необходим для html
function sassFunc() {
  return gulp
    .src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

function jsFunc() {
  return gulp
    .src(['node_modules/slick-carousel/slick/slick.js'])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());
}

function cssFunc() {
  return gulp
    .src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
      'node_modules/animate.css/animate.css',
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('src/sass'))
    .pipe(browserSync.stream());
}


exports.js = jsFunc;
exports.css = cssFunc;
exports.watch = watchFunc;
exports.copy = copyToDocs;
exports.clean = cleanUp;
exports.imgMin = imageMinify;
exports.build = series(cleanUp, cssFunc, jsFunc, cssMinify, copyToDocs, imageMinify);
exports.sass = sassFunc;
