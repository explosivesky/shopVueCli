/*
 * @Author: your name
 * @Date: 2022-01-17 22:52:54
 * @LastEditTime: 2022-01-19 18:03:44
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\main.js
 */
import Vue from 'vue'
import router from '@/router.js'
import echarts from 'echarts'
import store from '@/store'
import Request from '@/network/request.js'
import Url from '@/network/api.js'
Vue.config.productionTip = false
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueDND from 'awe-dnd'
Vue.use(VueDND)
Vue.use(ElementUI);
import App from './App.vue'
//引入模板数据
import conf from '@/common/config/data.js'
import errHint from '@/common/config/errHint.js'

let Loading = ElementUI.Loading
let loading
//防止重复点击
let num = 0
//打开loading
function showLoading() {
	if (num === 0) {
		loading = Loading.service({
			lock: true,
			text: '拼命加载中...',
			background: 'rgba(0, 0, 0, 0.7)'
		})
		num++
	}
}
//关闭 loading
function hideLoading() {
	// loading.close()
	if (num > 0) {
		num--
	}
	if (loading && num === 0) {
		Vue.nextTick(() => {
			loading.close()
		})
	}
}
Vue.prototype.$conf = conf
Vue.prototype.$echarts = echarts
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$prompt = ElementUI.MessageBox.prompt
Vue.prototype.$message = ElementUI.Message
Vue.prototype.request = Request
Vue.prototype.url = Url
Vue.prototype.$errHint = errHint
Vue.prototype.showLoading = showLoading
Vue.prototype.hideLoading = hideLoading

//自定义指令
Vue.directive('auth',{
	inserted(el,binding){
		let user = JSON.parse(window.sessionStorage.getItem('user'))
		//根据后端传来的数据 查找是否有这个功能，没有就把这个 dom 删除掉
		if(!user.super){
			let ruleNames = user.ruleNames
			let v =ruleNames.find(i=>i === binding.value)
			if(!v) el.parentNode.removeChild(el)
		}
	}
})
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
