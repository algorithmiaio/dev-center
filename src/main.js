import Vue from 'vue'
import CodeSample from './components/CodeSample'
import SideNavMenu from './components/SideNavMenu'
import Toast from './components/Toast'
import { getCurrentUser } from './api/user'
import { setupPage } from './utils/setupPage'

Vue.component('codeSample', CodeSample)
Vue.component('sideNavMenu', SideNavMenu)
Vue.component('toast', Toast)

const app = new Vue({
  el: '#vue-app',
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
