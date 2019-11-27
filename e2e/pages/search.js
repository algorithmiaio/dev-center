const DevelopersCenterBase = require('./DeveloperCenterBase')

class SearchPage extends DevelopersCenterBase {
  open(query = 'curl') {
    return browser.url(`/developers?q=${query}`)
  }

  get searchResults() {
    return $('[data-e2e="search-results"]')
  }

  get noResultsMessage() {
    return $('[data-e2e="search-no-results-msg"]')
  }

  get searchFilter() {
    return $('[data-e2e="search-filter"]')
  }

  get apiDocsFilterOption() {
    return this.searchFilter.$('[data-e2e="search-filter-API_DOCS"]')
  }

  get devCenterFilterOption() {
    return this.searchFilter.$('[data-e2e="search-filter-DEV_CENTER"]')
  }
}

module.exports = new SearchPage()
