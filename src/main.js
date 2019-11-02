import Vue from 'vue'
import HelloWorld from './components/HelloWorld'

Vue.component('helloWorld', HelloWorld)

const app = new Vue({
  el: '#vue-app'
})
