const signinPage = require('../pages/signin')
const { E2E_BASE_URL } = require('../config')
const { platformUser } = require('./platform')

const signIn = (
  username = platformUser.username,
  password = platformUser.password
) => {
  signinPage.open()
  signinPage.loginWithCredentials(username, password)
  browser.waitUntil(
    () =>
      browser.getUrl() ===
      `${E2E_BASE_URL}/users/${username || platformUser.username}`
  )
}

module.exports = {
  signIn,
}
