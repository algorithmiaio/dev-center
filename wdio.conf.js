const { E2E_BASE_URL } = require('./e2e/config')

const {
  E2E_RUN_IN_CLOUD,
  E2E_USE_TUNNEL,
  BROWSERSTACK_USERNAME,
  BROWSERSTACK_ACCESS_KEY
} = process.env

if (E2E_RUN_IN_CLOUD && (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY)) {
  throw new Error(
    'Missing Browserstack credentials. These are required for running end to end tests.'
  )
}

const TUNNEL_ENABLED = E2E_RUN_IN_CLOUD && E2E_USE_TUNNEL

const browserstackConfig = {
  user: BROWSERSTACK_USERNAME,
  key: BROWSERSTACK_ACCESS_KEY,
  browserstackLocal: !!TUNNEL_ENABLED
}

const sharedCapabilities = {
  'browserstack.local': TUNNEL_ENABLED ? 'true' : undefined,
  // Our API limits the number of max sessions a single signed in user can have
  // across multiple browsers as a security measure. This prevents us from
  // running multiple tests with the same user account in parallel.
  maxInstances: 1
}

const defaultConfig = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: ['./e2e/tests/*.spec.js'],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1 wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  //
  capabilities: [
    {
      'bstack:options': {
        os: 'Windows'
      },
      os_version: E2E_RUN_IN_CLOUD ? '10' : undefined,
      browserName: 'chrome',
      browserVersion: '75.0',
      ...sharedCapabilities
    },
    {
      'bstack:options': {
        os: 'OS X'
      },
      os_version: E2E_RUN_IN_CLOUD ? 'Mojave' : undefined,
      browserName: 'chrome',
      browserVersion: '75.0',
      ...sharedCapabilities
    }
  ]
    .filter(opts => {
      if (E2E_RUN_IN_CLOUD) return true

      // Only test Chrome locally
      return (
        ['chrome'].includes(opts.browserName) &&
        (opts['bstack:options'] || {}).os === 'OS X'
      )
    })
    // Only force specific versions when running in the cloud. Default to
    // whatever versions are installed on your computer when running locally.
    .map(opts =>
      E2E_RUN_IN_CLOUD ? opts : { ...opts, browserVersion: undefined }
    ),
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: 'error',
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: E2E_BASE_URL,
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: TUNNEL_ENABLED ? 60000 : 10000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [E2E_RUN_IN_CLOUD ? 'browserstack' : 'selenium-standalone'],
  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  reporters: ['spec'],
  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: 180000
  },
  before: () => {
    require('./e2e/utilities/waitForUrl')
    // Ensure each browser uses the same viewport size before running tests.
    // Safari and Chrome like to open at different sizes which causes some
    // issues as media queries kick in.
    browser.setWindowSize(1250, 768)
  }
}

exports.config = Object.assign(
  {},
  defaultConfig,
  E2E_RUN_IN_CLOUD ? browserstackConfig : {}
)
