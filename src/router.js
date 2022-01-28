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
export default router