import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.prototype.$loading = Element.Loading.service
Vue.prototype.$msgbox = Element.MessageBox
Vue.prototype.$alert = Element.MessageBox.alert
Vue.prototype.$confirm = Element.MessageBox.confirm
Vue.prototype.$prompt = Element.MessageBox.prompt
Vue.prototype.$notify = Element.Notification
Vue.prototype.$message = Element.Message

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
