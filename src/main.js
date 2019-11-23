import Vue from 'vue'
import { scrollspy } from 'uiv'
import CodeSample from './components/CodeSample'
import ImagePopout from './components/ImagePopout'
import ImagesSection from './components/ImagesSection'
import SideNavMenu from './components/SideNavMenu'
import Toast from './components/Toast'
import { getCurrentUser } from './api/user'
import { setupPage } from './utils/setupPage'

Vue.component('codeSample', CodeSample)
Vue.component('imagePopout', ImagePopout)
Vue.component('imagesSection', ImagesSection)
Vue.component('sideNavMenu', SideNavMenu)
Vue.component('toast', Toast)

Vue.directive('scrollspy', scrollspy)

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
