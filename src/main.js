import Vue from 'vue'
import { scrollspy } from 'uiv'
import CodeSample from './components/CodeSample'
import ImagePopout from './components/ImagePopout'
import ImagesSection from './components/ImagesSection'
import SideNavMenu from './components/SideNavMenu'
import Toast from './components/Toast'
import SearchResults from './components/SearchResults'
import SearchInput from './components/SearchInput'
import { getCurrentUser } from './api/user'
import { setupPage } from './utilities/setupPage'
import { redirectApiDocsHash  } from './utilities/redirectApiDocsHash'
import store from './store/index'
import { readCookie } from './utilities/cookie'
import { Cookie } from './enums/Cookie'
import { mapActions, mapGetters } from 'vuex'

// Redirect legacy API docs routes to new routes if hash is present
redirectApiDocsHash()

Vue.component('codeSample', CodeSample)
Vue.component('imagePopout', ImagePopout)
Vue.component('imagesSection', ImagesSection)
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
  async mounted() {
    await this.loadUser()
    this.setStateFromCookies()
    setupPage(this.user)
  }
})
