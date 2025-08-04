const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@auth/core)/)', // transform ESM packages
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '/tests/'],
  silent: false,
};

module.exports = createJestConfig(customJestConfig);
