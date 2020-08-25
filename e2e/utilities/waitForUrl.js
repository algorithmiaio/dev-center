const { isEquivalent } = require('./url')

const waitForUrl = (exact = true) => (expectedUrl, timeout = 30000) => {
  let url

  try {
    return browser.waitUntil(
      () => {
        url = browser.getUrl()

        // This slash is added by Selenium
        if (!expectedUrl.endsWith('/')) {
          url = url.replace(/\/$/, '')
        }

        return exact ? expectedUrl === url : isEquivalent(expectedUrl, url)
      },
      timeout,
      ''
    )
  } catch (error) {
    let message = 'Could not wait for required url:'
    message += `\n\tActual: ${url}`
    message += `\n\tExpected: ${expectedUrl}`

    throw new Error(message)
  }
}

browser.addCommand('waitForUrl', waitForUrl(false))
browser.addCommand('waitForExactUrl', waitForUrl(true))
