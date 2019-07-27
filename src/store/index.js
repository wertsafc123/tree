    
import Vue from 'vue'
import Vuex from 'vuex'
import contactTree from './modules/contatTree'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    contactTree
  },
});