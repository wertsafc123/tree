import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './locales';
import Antd from 'ant-design-vue';
import './antd.css';

Vue.prototype.eventBus = new Vue();

Vue.config.productionTip = false
Vue.use(Antd);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
