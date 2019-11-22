const { caseInsensitiveEquals } = require('./util')

const baseUrl = process.env.BASE_URL || 'algorithmia.com'

module.exports = {
  env: {
    disableHSTS: caseInsensitiveEquals(process.env.DISABLE_HSTS, 'true'),
    disableXXSSProtection: caseInsensitiveEquals(
      process.env.DISABLE_X_XSS_PROTECTION,
      'true'
    ),
    disableXContentTypeOptions: caseInsensitiveEquals(
      process.env.DISABLE_X_CONTENT_TYPE_OPTIONS,
      'true'
    ),
    disableXFrameOptions: caseInsensitiveEquals(
      process.env.DISABLE_X_FRAME_OPTIONS,
      'true'
    ),
    stage: {
      cspEnabled: caseInsensitiveEquals(process.env.ENFORCE_CSP, 'true'),
      devCenterUrl: 'http://localhost:4001',
      webapiUrl: process.env.WEBAPI_BASE_URL || `https://${baseUrl}`,
      prometheusToken: process.env.PROMETHEUS_TOKEN,
    },
  },
}
