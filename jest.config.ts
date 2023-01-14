import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  bail: 5,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)'],
  coveragePathIgnorePatterns: [
    '<rootDir>/tests/helpers/',
    '<rootDir>/node_modules/'
  ],
  moduleFileExtensions: [
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'web.js',
    'js',
    'web.jsx',
    'jsx',
    'json',
    'node',
    'mjs'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { /* ts-jest config goes here in Jest */ }]
  },
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  collectCoverage: false,
  clearMocks: true
}
