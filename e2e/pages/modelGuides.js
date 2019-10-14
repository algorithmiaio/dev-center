const DeveloperCenterBase = require('./DeveloperCenterBase')

class ModelGuidesPage extends DeveloperCenterBase {
  get redirectPath() {
    return '/developers/model-deployment'
  }

  open() {
    return browser.url('/developers/algorithm-development/model-guides')
  }
}

module.exports = new ModelGuidesPage()
