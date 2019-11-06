module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "vue"
  ],
  snapshotSerializers: ["jest-serializer-vue"],
  testMatch: ["**/jest/*.+(ts|tsx|js)"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  }
}
