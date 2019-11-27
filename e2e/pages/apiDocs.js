const DevelopersCenterBase = require('./DeveloperCenterBase')

class ApiDocsPage extends DevelopersCenterBase {
  open() {
    return browser.url('/developers/api')
  }
}

module.exports = new ApiDocsPage()
