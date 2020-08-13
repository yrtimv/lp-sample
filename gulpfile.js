const path = require('path');

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

const settings = {
    src: 'src',
    dist: 'dist',
    bundle: {
        scripts: 'bundle.min.js',
        styles: 'main.min.css',
    },
};

// Browser sync task
gulp.task('browser-sync', () => {
    browserSync.init({
        open: false,
        server: {
            baseDir: settings.dist,
        },
    });

    gulp.watch(`${settings.dist}/**/*`).on('change', browserSync.reload);
});

// Compile templates task
gulp.task('templates:compile', () => {
    return gulp
        .src(path.resolve(settings.src, 'template', 'index.pug'))
        .pipe(
            pug({
                pretty: true,
            })
        )
        .pipe(gulp.dest(settings.dist));
});

// Compile styles task
gulp.task('styles:compile', () => {
    return gulp
        .src(path.resolve(settings.src, 'styles', 'main.scss'))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename(settings.bundle.styles))
        .pipe(gulp.dest(path.resolve(settings.dist, 'css')));
});

// Compile scripts task
gulp.task('scripts:compile', () => {
    return (
        gulp
            .src(`${settings.src}/scripts/**/*.js`)
            .pipe(sourcemaps.init())
            .pipe(concat(settings.bundle.scripts))
            //  .pipe(uglify())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.resolve(settings.dist, 'scripts')))
    );
});

// Prepate sprites task
gulp.task('sprites', (callback) => {
    const spriteData = gulp.src(`${settings.src}/images/icons/*.png`).pipe(
        spritesmith({
            imgName: 'sprite.png',
            imgPath: '../images/sprite.png',
            cssName: 'sprite.scss',
        })
    );

    spriteData.img.pipe(gulp.dest(path.resolve(settings.dist, 'images')));
    spriteData.css.pipe(
        gulp.dest(path.resolve(settings.dist, 'styles', 'global'))
    );

    callback();
});

// Clean up task
gulp.task('clean', (callback) => rimraf(settings.dist, callback));

// Copy fonts task
gulp.task('copy:fonts', () =>
    gulp
        .src(path.resolve(settings.src, 'fonts', '**', '*.*'))
        .pipe(gulp.dest(path.resolve(settings.dist, 'fonts')))
);

// Copy images task
gulp.task('copy:images', () =>
    gulp
        .src(path.resolve(settings.src, 'images', '**', '*.*'))
        .pipe(gulp.dest(path.resolve(settings.dist, 'images')))
);

// Parallel copy tasks
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// Watchers task
gulp.task('watch', () => {
    gulp.watch(
        `${settings.src}/template/**/*.pug`,
        gulp.series('templates:compile')
    );
    gulp.watch(
        `${settings.src}/styles/**/*.scss`,
        gulp.series('styles:compile')
    );
    gulp.watch(
        `${settings.src}/scripts/**/*.js`,
        gulp.series('scripts:compile')
    );
});

// Default task
gulp.task(
    'default',
    gulp.series(
        'clean',
        gulp.parallel(
            'templates:compile',
            'styles:compile',
            'scripts:compile',
            'sprites',
            'copy'
        ),
        gulp.parallel('watch', 'browser-sync')
    )
);
