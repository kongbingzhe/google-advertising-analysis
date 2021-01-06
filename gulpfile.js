const { src, dest, parallel } = require('gulp');
// const less = require('gulp-less');
const babel = require('gulp-babel');
const miniHtml = require('gulp-minify-html');
const minifyCSS = require('gulp-csso');
const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');
const rename = require('gulp-rename');
const browserify = require('gulp-browserify');
const notify = require('gulp-notify')
const srcPath = 'src/'
const distPath = 'build/'

function html () {
  return src(srcPath + '*.html')
    .pipe(miniHtml())
    .pipe(dest(distPath))
    .pipe(notify('HTML task complete'))
}

function css () {
  return src(srcPath + 'styles/*')
    // .pipe(less())
    // .pipe(concat('custom.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifyCSS())
    .pipe(dest(distPath + 'styles'))
    .pipe(notify('CSS task complete'))
}

function js () {
  return src(srcPath + 'scripts/*.js')
    .pipe(babel({ presets: ['@babel/env'], "plugins": ["@babel/plugin-transform-runtime"] }))
    .pipe(browserify({
      insertGlobals : true,
    }))
    .pipe(uglify())
    .pipe(dest(distPath + 'scripts', { sourcemaps: true }))
    .pipe(notify('JS task complete'))
}

function copyManifest () {
  return src('manifest.json')
    .pipe(dest(distPath))
}

function copyImage () {
  return src(srcPath + 'images/**/*')
    .pipe(dest(distPath + 'images'))
}

function copyLibrary () {
  return src(srcPath + 'scripts/Library/**/*')
    .pipe(dest(distPath + 'scripts/Library'))
}

function zip () {
  const date = new Date().getTime()
  return src('src/*')
    .pipe(zip(`GetUAnalyse-${date}.zip`))
    .pipe(dest('dist'))
}


exports.js = js;
exports.css = css;
exports.html = html;
exports.zip = zip;
exports.default = parallel(css, js, html, parallel(
  copyManifest,
  copyImage,
  copyLibrary
));