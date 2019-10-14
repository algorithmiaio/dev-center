class Page {
  get signinLink() {
    return $('[data-e2e="header-signin-link"]')
  }

  open(path) {
    return browser.url(path)
  }
}

module.exports = Page
