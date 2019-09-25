const { caseInsensitiveEquals } = require('./util')

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
  },
}
