const Page = require('./BasePage')

class DevelopersCenterPageBase extends Page {
  get header() {
    return $('h2')
  }

  get searchInput() {
    return $('#search-query')
  }

  get firstSearchResult() {
    return $('#search-results article')
  }

  get clientGuidesListItem() {
    return $('ul.nav.sidebar a[href="/developers/clients"]')
  }

  get clientGuidesList() {
    return $('ul.nav.sidebar a[href="/developers/clients"] + ul')
  }

  get curlGuideListItem() {
    return this.clientGuidesList.$('a[href="/developers/clients/curl"]')
  }

  get pageTitle() {
    return $('#page-title')
  }

  open() {
    return super.open('/developers')
  }

  searchFor(query) {
    this.searchInput.setValue(query)
  }
}

module.exports = DevelopersCenterPageBase
