const signinPage = require('../pages/signin')
const { USERNAME, PASSWORD, E2E_BASE_URL } = require('../config')

const COOKIE_NAME = 'ALGO_SESSION_test'

const signOut = () => browser.deleteCookies([COOKIE_NAME])

const signIn = (username = USERNAME, password = PASSWORD) => {
  signinPage.open()
  signinPage.loginWithCredentials(username, password)
  browser.waitUntil(
    () => browser.getUrl() === `${E2E_BASE_URL}/users/${username || USERNAME}`
  )
}

module.exports = {
  signIn,
  signOut,
}
