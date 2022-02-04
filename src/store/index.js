import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import goods_create from './modules/goods_create.js'
import user from './modules/user.js'
import menu from './modules/menu.js'
let store = new Vuex.Store({
	modules:{
		goods_create,
		user,
		menu
	}
})

export default store