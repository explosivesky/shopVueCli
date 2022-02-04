export default {
	state:{
		navbar:{
			activeIndex:'0',
			list:JSON.parse(window.sessionStorage.getItem('menu'))||[],
		}
	},
	mutations:{
		/**
		 title: '首页',
		 subActiveIndex: '0',
		 itemList: [
		 	{
		 		name: '后台首页',
		 		icon: 'el-icon-s-home',
		         router_name:'index'
		 	},
		 	{
		 		name:'相册管理',
		 		icon:'el-icon-picture-outline',
		 		router_name:'imageManage'
		 	}
		 ]
		 */
		//根据后端返回的数据整合成 layout 需要的数据类型
		getMenu(state,menus){
			//根据 layout 需要的数据 整合成 layout 的数据类型
			state.navbar.list = menus.map(item=>{
				let itemList = item.child.map(v=>{
					return{
						name:v.name,
						icon:v.icon,
						router_name:v.desc
					}
				})
				return{
					title:item.name,
					subActiveIndex:'0',
					itemList:itemList
				}
			})
			//保存到本地
			window.sessionStorage.setItem('menu',JSON.stringify(state.navbar.list))
		}
	},
	getters:{
		//返回此角色对应数据中默认加载的第一个页面
		defaultRoute(state){
			//没有数据就返回 404 路由页面
			if(state.navbar.list.length===0){
				return 'error_404'
			}
			//获取数据中第一个页面
			let name = state.navbar.list[0].itemList[0].router_name
			if(name){
				return name
			}
		}
	}
}