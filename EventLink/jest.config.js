module.exports = {
  preset: 'react-native',
  testEnvironment: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo-router)',
  ],
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'node',
};