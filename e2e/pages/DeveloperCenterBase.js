const Page = require('./BasePage')

class DevelopersCenterPageBase extends Page {
  get header() {
    return $('#page-title')
  }

  get searchInput() {
    return $('[data-e2e="search-input"]')
  }

  get hamburgerMenu() {
    return $('[data-e2e="nav-hamburger"]')
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

  get isSideNavOpen() {
    return this.searchInput.isDisplayed()
  }

  get devCenterMenuSection() {
    return $('a[href="/developers"][title="Developer Docs"]')
  }

  get apiDocsMenuSection() {
    return $('a[href="/developers/api"][title="API Docs"]')
  }

  get apiDocsSubMenu() {
    return $('a[href="/developers/api"][title="API Docs"] + div > [data-e2e="nav-submenu"]')
  }

  get apiDocsHomeLink() {
    return this.apiDocsSubMenu.$('a[href="/developers/api"]')
  }

  open() {
    return super.open('/developers')
  }

  openSideNav() {
    this.hamburgerMenu.click()
    browser.waitUntil(() => this.searchInput.isDisplayed())
  }

  searchFor(query) {
    this.searchInput.setValue(query)
  }
}

module.exports = DevelopersCenterPageBase
