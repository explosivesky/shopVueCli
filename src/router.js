/*
 * @Author: your name
 * @Date: 2022-01-18 11:01:07
 * @LastEditTime: 2022-01-18 11:09:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\router.js
 */
import vueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(vueRouter)
import routes from '@/common/config/router.js'
const router = new vueRouter({
	routes
})
router.beforeEach((to, from, next) => {
	console.log(to)
	let token = window.sessionStorage.getItem('token')
	//已登录
	if (token) {
		//防止重复登录
		if (to.name == 'login') {
			Vue.prototype.$message.error('请不要重复登录')
			return next({
				name: from.name ? from.name : 'index'
			})
		}
		//防止 404 页面死循环
		if (to.name !== 'error_404') {
			//防止低权限角色访问 高权限角色的路由
			let rules = JSON.parse(window.sessionStorage.getItem('rules'))
			rules = rules ? rules : []
			//判断数据中有没有 此角色可以访问的路由 
			let index = rules.findIndex(v => v.rule_id > 0 && v.desc == to.name)
			//如果没有就跳转到 404 页面
			if (index === -1) {
				Vue.prototype.$message.error('你不能访问')
				//如果 from.name 不存在就是 刷新进入的
				next({
					name: from.name ? from.name : "error_404"
				})
			}
		}
		next()
	} else {
		//跳过登陆页面防止死循环
		if (to.name == 'login') {
			return next()
		}
		//未登录
		Vue.prototype.$message.error('请先登录')
		next({
			name: 'login'
		})
	}
})
export default router
