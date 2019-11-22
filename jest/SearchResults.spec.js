import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import SearchResults from '@/components/SearchResults'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('SearchResults', () => {
  let getters
  let store

  it('Renders "No results" if no results are present', () => {
    getters = {
      query: () => '',
      results: () => ''
    }

    store = new Vuex.Store({
      getters
    })

    const wrapper = shallowMount(SearchResults, { store, localVue })
    const header = wrapper.find('h4')
    expect(header.text()).toBe('No Results')
  })

  it('Renders query within header', () => {
    getters = {
      query: () => 'how to make spaghetti',
      results: () => ''
    }

    store = new Vuex.Store({
      getters
    })

    const wrapper = shallowMount(SearchResults, { store, localVue })
    const header = wrapper.find('h1')
    expect(header.text()).toBe('Search results for "how to make spaghetti"')
  })

  it('Renders content if results are present', () => {
    const results = [
      {
        id: 1,
        is_api_result: false,
        title: 'Open your IDE',
        url: '/how-to-make-spaghetti',
        excerpt: 'The first step to making spaghetti is to open your IDE. The second step...'
      }
    ]
    getters = {
      query: () => 'spaghetti',
      results: () => results
    }

    store = new Vuex.Store({
      getters
    })

    const wrapper = shallowMount(SearchResults, { store, localVue })
    const header = wrapper.find('h3')
    expect(header.text()).toBe(results[0].title)
  })
})
