import Vue from 'vue'

export const user = {
  state: {
    preferences: {
      language: ''
    }
  },
  mutations: {
    SET_PREFERRED_LANGUAGE: (state, payload) => {
      Vue.set(state.preferences, 'language', payload.language)
    },
  },
  actions: {
    setPreferredLanguage({ commit }, language) {
      commit('SET_PREFERRED_LANGUAGE', { language })
    },
  },
  getters: {
    preferredLanguage: state => state.preferences.language,
  }
}
