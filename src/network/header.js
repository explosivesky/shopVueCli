import axios from 'axios'
import {Message} from 'element-ui'
import Vue from 'vue'
let instance = axios.create({
	 timeout: 6000,
})
instance.interceptors.request.use((config)=>{
	let token = window.sessionStorage.getItem('token')
	//可以根据这个 config.token 判断是否为白名单 免token登录
	if(config.token===true){
		config.headers['token']=token
	}
	if(config.loading===true){
		Vue.prototype.showLoading()
	}
	return config
},(err)=>{
	// 对请求错误做些什么
	Vue.prototype.hideLoading()
		return Promise.reject(error);
})

instance.interceptors.response.use(res=>{
	Vue.prototype.hideLoading()
	return res
},(err)=>{
	Vue.prototype.hideLoading()
	if(err.response&&err.response.data){
		Message.error(err.response.data.msg)
	}
	return Promise.reject(err)
})
export default instance