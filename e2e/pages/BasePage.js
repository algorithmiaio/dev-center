class Page {
  open(path) {
    return browser.url(path)
  }
}

module.exports = Page
