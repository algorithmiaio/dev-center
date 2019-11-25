import Vue from 'vue'
import { scrollspy } from 'uiv'
import CodeSample from './components/CodeSample'
import SideNavMenu from './components/SideNavMenu'
import Toast from './components/Toast'
import SearchResults from './components/SearchResults'
import SearchInput from './components/SearchInput'
import { getCurrentUser } from './api/user'
import { setupPage } from './utilities/setupPage'
import store from './store/index'

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
    user: null
  },
  async mounted() {
    try {
      this.user = await getCurrentUser()
    } catch (err) {
      console.error(err.message)
    }

    setupPage(this.user)
  }
})
