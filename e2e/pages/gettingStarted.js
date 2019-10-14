const DeveloperCenterPage = require('./DeveloperCenterBase')

class GettingStartedPage extends DeveloperCenterPage {
  get toastMessage() {
    return $('#toast-container')
  }

  get firstCodeExampleCopyIcon() {
    return $('.gs-code-container button')
  }

  get secondCodeExampleCodePane() {
    return $$('.gs-code-container')[1]
  }

  get usernamePlaceholder() {
    return $$('.hover-info')[0]
  }

  get apiKeyPlaceholder() {
    return $$('.hover-info')[1]
  }

  get usernameHoverMessage() {
    return this.usernamePlaceholder.$(`.hover-content`)
  }

  get apiKeyHoverMessage() {
    return this.apiKeyPlaceholder.$(`.hover-content`)
  }

  get languageToggleButton() {
    return $('button.dropdown-toggle')
  }

  get selectedLanguage() {
    return this.languageToggleButton.$('span:first-of-type')
  }

  get languageCodeBlock() {
    return $$('.gs-code-container')[2].$('.gs-pane:not(.ng-hide)')
  }

  get javaLanguageOption() {
    return $$('.gs-languages li')[1]
  }

  open() {
    return browser.url('/developers/getting-started')
  }

  searchFor(query) {
    this.searchInput.setValue(query)
  }
}

module.exports = new GettingStartedPage()
