import Vue from 'vue'
import CodeSample from './components/CodeSample'

Vue.component('codeSample', CodeSample)

const app = new Vue({
  el: '#vue-app'
})
