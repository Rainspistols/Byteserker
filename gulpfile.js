const { watch, src, dest, series, parallel } = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpackStream = require('webpack-stream');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const webp = require('imagemin-webp');
const extReplace = require('gulp-ext-replace');

const CONFIG = {
  src: {
    js: ['./src/js/**/*.js'],
    sass: './src/sass/**/*.scss',
    images: './src/img/**/*.*',
    html: './src/**/*.html',
    pngJpeg: './src/img/*.{jpg,png}',
  },
  docs: {
    base: './docs/',
    images: './docs/img/',
  },
};

function cssTask(done) {
  src(CONFIG.src.sass)
    .pipe(sass())
    .pipe(rename({ suffix: '.bundle' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(CONFIG.docs.base));

  done();
}

function jsTask(done) {
  src(CONFIG.src.js)
    .pipe(
      webpackStream({
        output: {
          filename: 'main.js',
        },
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',
              query: {
                presets: ['@babel/preset-env'],
              },
            },
          ],
        },
      })
    )
    .pipe(rename({ suffix: '.bundle' }))
    .pipe(uglify())
    .pipe(dest(CONFIG.docs.base));

  done();
}

function templateTask(done) {
  src(CONFIG.src.html)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(CONFIG.docs.base));
  done();
}

function imagesTask(done) {
  src(CONFIG.src.images)
    .pipe(imagemin())
    .pipe(dest(CONFIG.docs.images));
  done();
}

function imagesTaskWebp(done) {
  src(CONFIG.src.pngJpeg)
    .pipe(
      imagemin([
        webp({
          quality: 75,
        }),
      ])
    )
    .pipe(extReplace('.webp'))
    .pipe(dest(CONFIG.docs.images));
  done();
}

function liveReload(done) {
  browserSync.init({
    server: {
      baseDir: CONFIG.docs.base,
    },
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function cleanUp() {
  return del([CONFIG.docs.base]);
}

function watchChanges() {
  watch(CONFIG.src.sass, series(cssTask, reload));
  watch(CONFIG.src.html, series(templateTask, reload));
  watch(CONFIG.src.js, series(jsTask, reload));
  watch(CONFIG.src.images, series(imagesTask, reload));
}

exports.dev = parallel(
  jsTask,
  cssTask,
  templateTask,
  imagesTask,
  imagesTaskWebp,
  watchChanges,
  liveReload
);
exports.build = series(
  cleanUp,
  parallel(jsTask, cssTask, imagesTask, imagesTaskWebp, templateTask)
);
