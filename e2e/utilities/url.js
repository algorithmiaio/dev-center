const withoutTrailingSlash = url => url.replace(/\/$/, '')

const isEquivalent = (url1, url2) =>
  withoutTrailingSlash(url1) === withoutTrailingSlash(url2)

module.exports = {
  isEquivalent,
  withoutTrailingSlash,
}
