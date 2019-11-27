const {
  E2E_MAC_USERNAME,
  E2E_MAC_EMAIL,
  E2E_MAC_PASSWORD,
  E2E_PC_USERNAME,
  E2E_PC_EMAIL,
  E2E_PC_PASSWORD,
  E2E_USE_TUNNEL,
} = process.env

const MAC_USERNAME = E2E_MAC_USERNAME || 'justin_long'
const MAC_EMAIL = E2E_MAC_EMAIL || 'algorithmia.e2e.testing+mac@gmail.com'
const MAC_PASSWORD = E2E_MAC_PASSWORD || 'allGR33Nplease!'
const PC_USERNAME = E2E_PC_USERNAME || 'john_hodgman'
const PC_EMAIL = E2E_PC_EMAIL || 'algorithmia.e2e.testing+pc@gmail.com'
const PC_PASSWORD = E2E_PC_PASSWORD || 'allGR33Nplease!'

const E2E_BASE_URL = process.env.E2E_BASE_URL || 'https://test.algorithmia.com'
const E2E_RUN_IN_CLOUD = process.env.E2E_RUN_IN_CLOUD || false
const LOCAL_PLATFORM = process.platform

const TUNNEL_ENABLED = E2E_RUN_IN_CLOUD && E2E_USE_TUNNEL
const IS_RUNNING_E2E_LOCALLY = !E2E_RUN_IN_CLOUD || TUNNEL_ENABLED

module.exports = {
  E2E_BASE_URL,
  E2E_RUN_IN_CLOUD,
  LOCAL_PLATFORM,
  IS_RUNNING_E2E_LOCALLY,
  MAC_EMAIL,
  MAC_PASSWORD,
  MAC_USERNAME,
  PC_EMAIL,
  PC_PASSWORD,
  PC_USERNAME
}
