import lunr from 'lunr'
import axios from 'axios'

class Lunr {
  static create(searchJsonPath) {
    const instance = new Lunr()
    instance.init(searchJsonPath)
    return instance
  }

  async init(searchJsonPath) {
    try {
      const { data } = await axios(searchJsonPath)
      const { index, docs } = data

      this.docs = docs
      this.index = lunr.Index.load(index)
    } catch (err) {
      console.error('Issue while initializing search: ', err)
    }
  }

  search(query, filter = '') {
    let matches = []

    if (!this.index) return matches

    switch (filter) {
      case 'API_DOCS':
        matches = this.index.search(`+is_api_result:true +${query}`)
        break
      case 'DEV_CENTER':
        matches = this.index.search(`+is_api_result:false +${query}`)
        break
      case 'NONE':
      default:
        matches = this.index.search(query)
    }

    return matches.map(({ ref }) => this.docs[ref])
  }
}

export const searchIndex = Lunr.create('/developers/js/search.json')
