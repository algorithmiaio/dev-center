const DeveloperCenterPage = require('./DeveloperCenterBase')

class GettingStartedPage extends DeveloperCenterPage {
  get toastMessage() {
    return $('.syn-toast')
  }

  get firstCodeExampleCopyIcon() {
    return $('.syn-code-block button')
  }

  get secondCodeExampleCodePane() {
    return $$('.syn-code-block')[1]
  }

  get languageSelector() {
    return $('.syn-code-language-selector')
  }

  get selectedLanguage() {
    return this.languageSelector.getValue()
  }

  get javaOption() {
    return this.languageSelector.$('option[value="java"]')
  }

  get notice() {
    return $('.syn-code-block:nth-of-type(2) + p')
  }

  open() {
    return browser.url('/developers/getting-started/')
  }
}

module.exports = new GettingStartedPage()
