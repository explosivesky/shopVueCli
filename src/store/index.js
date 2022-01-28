import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import goods_create from './modules/goods_create.js'
let store = new Vuex.Store({
	modules:{
		goods_create
	}
})

export default store