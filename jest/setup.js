const nock = require('nock')

module.exports = async () => {
  const index = {
    docs: {},
    index: {
      version: '2.3.8',
      fields: [],
      fieldVectors: [],
      invertedIndex: [],
      pipeline: []
    }
  }

  nock(/.+/)
    .get('/developers/js/search.json')
    .reply(200, index)
}
