import lunr from 'lunr'

export class Lunr {
  static create(searchJsonPath) {
    const instance = new Lunr()
    instance.init(searchJsonPath)
    return instance
  }

  async init(searchJsonPath) {
    try {
      const res = await fetch(searchJsonPath)
      const { index, docs } = await res.json()

      this.docs = docs
      this.index = lunr.Index.load(index)
    } catch (err) {
      console.error('Issue while initializing search: ', err)
    }
  }

  search(query, filter = '') {
    if (!this.index) return

    switch (filter) {
      case 'API-DOCS':
        return this.index.search(`+is_api_result:true ${query}`)
      case 'DEV-CENTER':
        return this.index.search(`+is_api_result:false ${query}`)
      case '':
      default:
        return this.index.search(query)
    }
  }
}

// If there is a query string that will get picked up by lunrSearch
//   then hide the page content by default
// Note: the search input field doesn't get set by lunrSearch until search.json loads
export function showSearchPageIfQueryExists() {
  const query = new URL(window.location).searchParams;

  if (query.has('q') && query.get('q').length >= 3) {
    console.log('Has query string')
    // $('#main-content').hide();
    document.getElementById('search-query').focus()
  }
}

