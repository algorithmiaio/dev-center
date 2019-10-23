module.exports = function isHtmlRequest(path) {
  const [ domain ] = path.split(/[#?]/)
  return /\.html$/.test(domain)
}
