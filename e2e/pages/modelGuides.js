const DeveloperCenterBase = require('./DeveloperCenterBase')

class ModelGuidesPage extends DeveloperCenterBase {
  get redirectUrl() {
    return 'https://test.algorithmia.com/developers/model-deployment'
  }

  open() {
    return browser.url('/developers/algorithm-development/model-guides')
  }
}

module.exports = new ModelGuidesPage()
