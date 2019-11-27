import Vue from 'vue'
import { isClient } from '../utilities/env'
import { setCookieValue } from '../utilities/cookie'
import { Cookie } from '../enums/Cookie'

export const user = {
  state: {
    preferences: {
      isAppNavCollapsed: false,
      language: '',
    }
  },
  mutations: {
    SET_PREFERRED_LANGUAGE: (state, payload) => {
      Vue.set(state.preferences, 'language', payload.language)
    },
    SET_APP_NAV: (state, payload) => {
      state.preferences.isAppNavCollapsed = payload.isAppNavCollapsed
    }
  },
  actions: {
    setPreferredLanguage({ commit }, language) {
      commit('SET_PREFERRED_LANGUAGE', { language })
    },
    setIsAppNavCollapsed: ({ commit }, isAppNavCollapsed) => {
      commit('SET_APP_NAV', { isAppNavCollapsed })

      if (isClient()) {
        setCookieValue(
          Cookie.leftNavCollapsed,
          isAppNavCollapsed,
          { path: '/', daysUntilExpire: 365 }
        )
      }
    },
    toggleAppNav: ({ getters, dispatch }) => {
      dispatch('setIsAppNavCollapsed', !getters.isAppNavCollapsed)
    },
  },
  getters: {
    preferredLanguage: state => state.preferences.language,
    isAppNavCollapsed: state => state.preferences.isAppNavCollapsed,
  }
}
