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
Vue.config.productionTip = false
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueDND from 'awe-dnd'
Vue.use(VueDND)
Vue.use(ElementUI);
import App from './App.vue'
//引入模板数据
import conf from '@/common/config/data.js'
import routerCatch from '@/common/config/router_config.js'
Vue.prototype.$conf = conf
Vue.prototype.$echarts = echarts
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$prompt = ElementUI.MessageBox.prompt
Vue.prototype.$message = ElementUI.Message
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')
