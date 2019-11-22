module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.jest.json',
    },
  },
  globalSetup: './jest/setup.js',
  moduleFileExtensions: [
    "js",
    "json",
    "ts",
    "vue"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ["**/jest/*.spec.+(ts|tsx|js)"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest'
  }
}
