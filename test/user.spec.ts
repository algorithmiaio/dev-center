import Vue from 'vue'
import * as Vuex from 'vuex'
import { expect } from 'chai'
import 'mocha'
import { user } from '../src/store/user'
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
  modules: { user },
})

describe('Vuex: Search Store', () => {

  describe('mutations', () => {
    it('should set the correct state for SET_PREFERRED_LANGUAGE', () => {
      store.state.user.preferences.language = 'spanish'
      store.commit('SET_PREFERRED_LANGUAGE', { language: 'german' })
      expect(store.state.user.preferences.language).to.equal('german')
    })

    it('should set the correct state for SET_APP_NAV', () => {
      store.state.user.preferences.isAppNavCollapsed = false
      store.commit('SET_APP_NAV', { isAppNavCollapsed: true })
      expect(store.state.user.preferences.isAppNavCollapsed).to.equal(true)
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

    it('should commit correct mutations for setPreferredLanguage', () => {
      user.actions.setPreferredLanguage(context, 'italian')
      expect(commitSpy.args).to.deep.equal([
        ['SET_PREFERRED_LANGUAGE', { language: 'italian' }],
      ])
    })

    it('should commit correct mutations for setIsAppNavCollapsed', () => {
      user.actions.setIsAppNavCollapsed(context, true)
      expect(commitSpy.args).to.deep.equal([
        ['SET_APP_NAV', { isAppNavCollapsed: true }],
      ])
    })
  })

  describe('getters', () => {
    it('should return the correct state for preferredLanguage', () => {
      store.state.user.preferences.language = 'portuguese'
      expect(store.getters.preferredLanguage).to.equal('portuguese')
    })

    it('should return the correct state for isAppNavCollapsed', () => {
      store.state.user.preferences.isAppNavCollapsed = true
      expect(store.getters.isAppNavCollapsed).to.equal(true)
    })
  })
})
