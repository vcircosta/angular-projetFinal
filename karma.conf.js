// karma.conf.js
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-jasmine-html-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],

        client: {
            clearContext: false // affiche le résultat dans le navigateur
        },

        coverageReporter: {
            dir: require('path').join(__dirname, './coverage'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },

        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,

        // --- Browsers ---
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-translate',
                    '--disable-extensions',
                    '--disable-software-rasterizer'
                ]
            }
        },

        singleRun: true,
        restartOnFileChange: true,

        // --- Timeout pour éviter les crashs ---
        browserNoActivityTimeout: 60000, // 60s
        captureTimeout: 120000 // 2 min
    });
};
