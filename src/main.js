import Vue from 'vue'
import { mapGetters } from 'vuex'
import { scrollspy } from 'uiv'
import CodeSample from './components/CodeSample'
import SideNavMenu from './components/SideNavMenu'
import Toast from './components/Toast'
import SearchResults from './components/SearchResults'
import SearchInput from './components/SearchInput'
import { getCurrentUser } from './api/user'
import { setupPage } from './utilities/setupPage'
import store from './store/index'
import { readCookie } from './utilities/cookie'
import { Cookie } from './enums/Cookie'
import { mapActions, mapGetters } from 'vuex'

Vue.component('codeSample', CodeSample)
Vue.component('sideNavMenu', SideNavMenu)
Vue.component('toast', Toast)
Vue.component('searchInput', SearchInput)
Vue.component('searchResults', SearchResults)

Vue.directive('scrollspy', scrollspy)

const app = new Vue({
  el: '#vue-app',
  store,
  data: {
    user: null,
    isMobileMenuOpen: false
  },
  computed: {
    ...mapGetters(['showSearchResults', 'isAppNavCollapsed'])
  },
  methods: {
    ...mapActions(['setPreferredLanguage', 'setIsAppNavCollapsed', 'toggleAppNav']),
    toggleSideMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
      this.toggleAppNav()
    },
    async loadUser() {
      try {
        this.user = await getCurrentUser()
      } catch (err) {
        console.error(err.message)
      }
    },
    setStateFromCookies() {
      this.setPreferredLanguage(
        readCookie(Cookie.preferredLanguage) || ''
      )
      this.setIsAppNavCollapsed(
        readCookie(Cookie.leftNavCollapsed) === 'true'
      )
    }
  },
  mounted() {
    this.loadUser()
    this.setStateFromCookies()
    setupPage(this.user)
  }
})
