import Vue from 'vue'
import * as Vuex from 'vuex'
import { expect } from 'chai'
import 'mocha'
import { search, filter } from '../src/store/search'
import { searchIndex } from '../src/utilities/lunr'
import nock from 'nock'
import sinon from 'sinon'

Vue.use(Vuex)

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

const store: any = new Vuex.Store({
  modules: { search },
})

describe('Vuex: Search Store', () => {

  describe('mutations', () => {
    it('should set the correct state for SET_FILTER', () => {
      store.state.search.filter = filter.API_DOCS
      store.commit('SET_FILTER', { filter: filter.DEV_CENTER })
      expect(store.state.search.filter).to.deep.equal(filter.DEV_CENTER)
    })

    it('should set the correct state for SET_QUERY', () => {
      store.state.search.query = ''
      store.commit('SET_QUERY', { query: 'HAL-9000' })
      expect(store.state.search.query).to.deep.equal('HAL-9000')
    })

    it('should set the correct state for SET_RESULTS', () => {
      const updated = [ { anArray: 'reference' }]
      store.state.search.results = []
      store.commit('SET_RESULTS', { results: updated })
      expect(store.state.search.results).to.deep.equal(updated)
    })
  })

  describe('actions', () => {
    const commitSpy = sinon.spy()
    const dispatchSpy = sinon.spy()
    const rootState = { stage: {} }
    const context: any = {
      commit: commitSpy,
      dispatch: dispatchSpy,
      rootState,
      getters: store.getters
    }

    afterEach(() => {
      commitSpy.resetHistory()
      dispatchSpy.resetHistory()
    })

    it('should commit correct mutations for setFilter', () => {
      search.actions.setFilter(context, filter.DEV_CENTER)
      expect(commitSpy.args).to.deep.equal([
        ['SET_FILTER', { filter: filter.DEV_CENTER }],
      ])
    })

    it('should commit correct mutations for setQuery', () => {
      search.actions.setQuery(context, 'foobar')
      expect(commitSpy.args).to.deep.equal([
        ['SET_QUERY', { query: 'foobar' }],
      ])
    })

    describe('search action', () => {
      before(() => {
        sinon.stub(searchIndex, 'search').returns([])
      })

      it('should process results ', (done) => {
        store.state.search.query = 'something'
        search.actions.search(context)

        setTimeout(() => {
          expect(commitSpy.args).to.deep.equal([
            ['SET_RESULTS', { results: [] }],
          ])
          done()
        }, 1000)
      })
    })
  })

  describe('getters', () => {
    it('should return the correct state for filter', () => {
      store.state.search.filter = filter.NONE
      expect(store.getters.filter).to.equal(filter.NONE)
    })

    it('should return the correct state for query', () => {
      store.state.search.query = 'SearchTerm'
      expect(store.getters.query).to.equal('SearchTerm')
    })

    it('should return the correct state for results', () => {
      const arrayReference: any = [{foo: 'bar'}]
      store.state.search.results = arrayReference
      expect(store.getters.results).to.deep.equal(arrayReference)
    })

    describe('showSearchResults', () => {
      it('should return true if query exists', () => {
        store.state.search.query = 'something'
        expect(store.getters.showSearchResults).to.deep.equal(true)
      })

      it('should return false if no query exists', () => {
        store.state.search.query = ''
        expect(store.getters.showSearchResults).to.deep.equal(false)
      })
    })
  })
})
