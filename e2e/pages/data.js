const DevelopersCenterBase = require('./DeveloperCenterBase')

class DataPage extends DevelopersCenterBase {
  open() {
    return browser.url('/developers/api/data-api-specification')
  }

  get firstCodeExample() {
    return $('.syn-code-block')
  }

  get secondCodeExample() {
    return $$('.syn-code-block')[1]
  }

  get firstCodeLanguageSelector() {
    return this.firstCodeExample.$('.syn-code-language-selector')
  }

  get secondCodeLanguageSelector() {
    return this.secondCodeExample.$('.syn-code-language-selector')
  }

  get firstCodeSelectedLanguage() {
    return this.firstCodeLanguageSelector.getValue()
  }

  get secondCodeSelectedLanguage() {
    return this.secondCodeLanguageSelector.getValue()
  }

  get javaOption() {
    return this.firstCodeLanguageSelector.$('option[value="java"]')
  }

  get nodeOption() {
    return this.firstCodeLanguageSelector.$('option[value="Node"]')
  }
}

module.exports = new DataPage()
