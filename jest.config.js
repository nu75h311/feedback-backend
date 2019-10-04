module.exports = {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/controllers/**/*.test.[jt]s?(x)',
  ],

  moduleNameMapper: {
    '@controllers': '<rootDir>/src/controllers',
    '@interfaces': '<rootDir>src/interfaces',
    '@models': '<rootDir>src/models',
    '@routes': '<rootDir>src/routes',
    '@shared': '<rootDir>src/shared',
    '@server': '<rootDir>src/Server',
  },

  reporters: [
    'default',
    ['./node_modules/jest-html-reporter', {
      'pageTitle': 'feedback app backend test report',
      'theme': 'darkTheme',
    }]
  ]
};