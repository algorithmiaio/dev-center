module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "vue"
  ],
  testMatch: ["**/jest/*.+(ts|tsx|js)"],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest"
  }
}
