
export default function karmaConfig(config) {
  config.set({
    frameworks: [ 'mocha', 'chai', 'karma-typescript' ],
    
    files: [
      { pattern: 'src/**/*.ts' }
    ],

    preprocessors: {
      "src/**/*.ts": "karma-typescript"
    },

    reporters: ['mocha', 'karma-typescript'],

    browsers: ['ChromeHeadlessNoSandbox'],

    karmaTypescriptConfig: {
      include: [ "src/**/*" ],
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/
      },
      compilerOptions: {
        baseUrl: ".",
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        module: "commonjs",
        moduleResolution: "node",
        target: "es2015",
        lib :[
          "dom",
          "es2015",
          "es2017"
        ]
      }
    },

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    mime: {
      "text/x-typescript": ["ts"]
    },

    singleRun: true,
    concurrency: Infinity

  })
}