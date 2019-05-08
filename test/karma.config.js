module.exports = function (config) {
  config.set({
    frameworks: ["mocha", "chai", "karma-typescript"],
    files: [
      "../src/**/*.ts",
      "**/*.ts"
    ],
    preprocessors: {
      "../src/**/*.ts": "karma-typescript",
      "**/*.ts": "karma-typescript" // *.tsx for React Jsx
    },
    reporters: ["dots", "karma-typescript"],
    browsers: ['Chrome_Desktop'],
    customLaunchers: {
      'Chrome_Desktop': {
        base: 'Chrome',
        options: {
          viewportSize: {
            width: 1000,
            height: 1000
          }
        }
      }
    },
    karmaTypescriptConfig: {
      tsconfig: "../tsconfig.json",
      reports:
      {
        "html": {
          "directory": "test/coverage",
          "subdirectory": "report"
        },
        "text-summary": ""
      },
    },
  });
};
