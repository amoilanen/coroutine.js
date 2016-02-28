module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/promise-polyfill/Promise.js',
      './node_modules/regenerator/runtime.js',
      'compiled/coroutine.js',
      'compiled/*.spec.js'
    ],
    exclude: [
    ],
    reporters: ['spec', 'coverage'],
    preprocessors: {
      'compiled/coroutine.js': ['coverage']
    },
    coverageReporter: {
      type: 'text-summary'
    },
    colors: true,
    logLevel: config.LOG_INFO,
    captureTimeout: 20000,
    reportSlowerThan: 500,
    plugins: [
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-firefox-launcher',
      'karma-jasmine-html-reporter',
      'karma-spec-reporter',
      'karma-coverage'
    ]
  });
};