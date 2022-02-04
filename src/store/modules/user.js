export default {
	state:{
		user:JSON.parse(window.sessionStorage.getItem('user'))||{},
		token:false
	},
	mutations:{
		//登录
		login(state,user){
			//保存登陆状态
			state.user=user
			state.token=user.token
			//存储本地
			window.sessionStorage.setItem('user',JSON.stringify(state.user))
			window.sessionStorage.setItem('token',state.token)
		},
		//退出
		out(state){
			//清除token 和 user 数据
			state.user={}
			state.token=false
			window.sessionStorage.clear()
			window.localStorage.clear()
		}
	},
}