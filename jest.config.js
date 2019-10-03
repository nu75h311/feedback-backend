module.exports = {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/controllers/**/*.[jt]s?(x)',
  ],
};