const {
  E2E_RUN_IN_CLOUD,
  LOCAL_PLATFORM,
  MAC_USERNAME,
  MAC_PASSWORD,
  MAC_EMAIL,
  PC_USERNAME,
  PC_PASSWORD,
  PC_EMAIL,
} = require('../config')

const browserstackPlatforms = {
  MAC: 'MAC',
  WIN8: 'WIN8',
  XP: 'XP',
  WINDOWS: 'WINDOWS',
  ANY: 'ANY',
  ANDROID: 'ANDROID',
}

const nodePlatforms = {
  AIX: 'aix',
  DARWIN: 'darwin',
  FREEBSD: 'freebsd',
  LINUX: 'linux',
  OPENBSD: 'openbsd',
  SUNOS: 'sunos',
  WIN32: 'win32',
}

// If we're running in the cloud, check whether browserstack set platform to MAC
// If we're running locally, check if node process platform is darwin
const isMac = E2E_RUN_IN_CLOUD
  ? browser.capabilities.platform === browserstackPlatforms.MAC
  : LOCAL_PLATFORM === nodePlatforms.DARWIN

const platformUser = isMac
  ? {
      username: MAC_USERNAME,
      password: MAC_PASSWORD,
      email: MAC_EMAIL,
    }
  : {
      username: PC_USERNAME,
      password: PC_PASSWORD,
      email: PC_EMAIL,
    }

module.exports = {
  isMac,
  platformUser,
}
