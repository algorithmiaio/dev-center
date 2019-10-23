const { expect } = require('chai')
const isHtmlRequest = require('./isHtmlRequest')
require('mocha')

describe('isHtmlRequest', () => {
  it('should return true when html is requested', () => {
    [
      'developers/index.html',
      '/developers/index.html#fragment',
      '/getting-started/index.html?foo=bar#fragment',
      'https://algorithmia.com/developers/index.html',
      'https://algorithmia.com/developers/index.html?foo=bar#2',
      'https://algorithmia.com/developers.html?foo=bar#2',
      'https://algorithmia.com/developers/getting-started/index.html?foo=bar#fragment',
      'https://algorithmia.com/developers/getting-started.html?foo=bar#fragment',
    ].forEach(path => {
      expect(isHtmlRequest(path)).to.be.true
    })
  })

  it('should return false for all other requests', () => {
    [
      '',
      'developers/',
      '/developers/?foo=bar',
      'https://test.algorithmia.com/developers',
      'https://test.algorithmia.com/developers',
      'https://test.algorithmia.com/developers/index.js',
      'https://test.algorithmia.com/developers/index.js?foo=bar#2',
    ].forEach(path => {
      expect(isHtmlRequest(path)).to.be.false
    })
  })
})
