module.exports = {
  verbose: true,
  collectCoverage: true,
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Test Report',
      },
    ],
  ],
  coverageReporters: ['lcov', 'html'],
}
