const { E2E_USERNAME, E2E_PASSWORD, E2E_USE_TUNNEL } = process.env

const USERNAME = E2E_USERNAME || 'e2e_test_acct'
const PASSWORD = E2E_PASSWORD || 'allGR33Nplease!'
const E2E_BASE_URL = process.env.E2E_BASE_URL || 'https://test.algorithmia.com'
const E2E_RUN_IN_CLOUD = process.env.E2E_RUN_IN_CLOUD || false
const LOCAL_PLATFORM = process.platform

const TUNNEL_ENABLED = E2E_RUN_IN_CLOUD && E2E_USE_TUNNEL
const IS_RUNNING_E2E_LOCALLY = !E2E_RUN_IN_CLOUD || TUNNEL_ENABLED

module.exports = {
  USERNAME,
  PASSWORD,
  E2E_BASE_URL,
  E2E_RUN_IN_CLOUD,
  LOCAL_PLATFORM,
  IS_RUNNING_E2E_LOCALLY,
}
