const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

//sass task
function scssTask(){
    return src('./sass/**/*.scss' ,  {sourcemaps: true})
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('css', {sourcemaps: '.'}));
}

//javascript task
function jsTask(){
    return src('./js/*.js', {sourcemaps: true})
    .pipe(terser())
    .pipe(dest('js', {sourcemaps: '.'}));
}

//browser-sync tasks
function browsersyncServer(cb){
    browsersync.init({
        server: {
            baseDir: '.'
        },
        browser: "chrome",
        port: 8080,
        ui:{
            port: 8080
        }  
        

    });
    cb();
}

function browsersyncReload(cb){
    browsersync.reload();
    cb();
}

//watch task
function watchTask(){
    watch('*.html', browsersyncReload);
    watch(['./sass/**/*.scss','./js'], series(scssTask, jsTask, browsersyncReload));
}

// default Gulp task
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServer,
    watchTask
);