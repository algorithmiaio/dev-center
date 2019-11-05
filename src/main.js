import Vue from 'vue'
import CodeSample from './components/CodeSample'
import Toast from './components/Toast'

Vue.component('codeSample', CodeSample)
Vue.component('toast', Toast)

const app = new Vue({
  el: '#vue-app'
})
