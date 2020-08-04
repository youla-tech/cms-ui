// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// import './mock'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import uploader from 'vue-simple-uploader'
import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter
import '@/components/Permission'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)
Vue.use(codemirror)
Vue.use(uploader)
Vue.config.productionTip = false
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
