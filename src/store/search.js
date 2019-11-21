import Vue from 'vue'
import clone from 'clone'
import { debounce } from '../utils/debounce'
import { Lunr } from '../utils/lunr'

const searchIndex = Lunr.create('/developers/js/search.json')

export const filter = {
  NONE: { name: 'All results', value: 'NONE' },
  API_DOCS: { name: 'API Docs', value: 'API_DOCS' },
  DEV_CENTER: { name: 'Documentation', value: 'DEV_CENTER' },
}

export const search = {
  state: {
    query: '',
    filter: filter.NONE,
    results: []
  },
  mutations: {
    SET_FILTER: (state, payload) => {
      state.filter = payload.filter
    },
    SET_QUERY: (state, payload) => {
      state.query = payload.query
    },
    SET_RESULTS: (state, payload) => {
      // console.log('NEW RESULTS: ', JSON.stringify(payload.results, null, 2))
      Vue.set(state, 'results', payload.results)
      // state.results = payload.results
    }
  },
  actions: {
    setFilter({ commit, dispatch }, filter) {
      commit('SET_FILTER', { filter })
      dispatch('search')
    },
    setQuery({ commit, dispatch }, query) {
      commit('SET_QUERY', { query })
      dispatch('search')
    },

    search: debounce(({ commit, getters }) => {
      const { query, filter, areSearchResultsShown } = getters
      if (!areSearchResultsShown) return

      console.log('SEARCHING FOR: ', query)
      console.log('FILTER: ', filter.value)

      commit(
        'SET_RESULTS',
        { results: searchIndex.search(query, filter.value) }
      )
    }),
  },
  getters: {
    query: state => state.query,
    filter: state => state.filter,
    results: state => clone(state.results),
    areSearchResultsShown: (state, getters) => getters.query.length >= 3
  }
}
