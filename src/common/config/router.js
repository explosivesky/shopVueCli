/*
 * @Author: your name
 * @Date: 2022-01-18 11:03:33
 * @LastEditTime: 2022-01-18 15:18:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\common\config\router.js
 */
// import layout from '@/views/layout/layout'

let routes = [{
		path: '/',
		name: 'layout',
		redirect: {
			name: 'index'
		},
		component: 'layout/layout',
		children: [{
				meta:{title:'后台首页'},
				component:'index/index'
			},
			{
				meta:{title:'商品列表'},
				component:'shop/goods/list'
			},
			{
				meta:{title:'创建商品'},
				component:'shop/goods/create'
			},
			{
				meta:{title:'修改商品详情'},
				component:'shop/goods/content'
			},
			{
				meta:{title:'媒体设置'},
				component:'shop/goods/banner'
			},
			{
				meta:{title:'商品规格'},
				component:'shop/goods/sku'
			},
			{
				meta:{title:'属性设置'},
				component:'shop/goods/attr'
			},
			{
				meta:{title:'相册管理'},
				component:'image/index'
			},
			{
				meta:{title:'分类管理'},
				component:'shop/category/list'
			},
			{
				meta:{title:'商品规格管理'},
				component:'shop/sku/list'
			},
			{
				meta:{title:'商品类型管理'},
				component:'shop/type/list'
			},
			{
				meta:{title:'商品评论管理'},
				component:'shop/comment/list'
			},
			{
				meta:{title:'发票管理'},
				component:'order/invoice/list'
			},
			{
				meta:{title:'售后服务'},
				component:'order/after-sale/list'
			},
			{
				meta:{title:'订单列表'},
				component:'order/order/list'
			},
			{
				meta:{title:'会员列表'},
				component:'user/user-list/list'
			},
			{
				meta:{title:'会员等级'},
				component:'user/user-level/list'
			},
			{
				meta:{title:'基础设置'},
				component:'set/base/index'
			},
			{
				meta:{title:'物流设置'},
				component:'set/express/index'
			},
			{
				meta:{title:'管理员管理'},
				component:'set/manager/index'
			},
			{
				meta:{title:'交易设置'},
				component:'set/payment/index'
			}
		]
	},
	{
		meta: {
			title: '登录页面'
		},
		component: 'login/index'
	},
	{
		meta:{title:'404错误'},
		component:'error/404'
	},
	{
		path: '*',
		redirect: {
			name: 'index'
		}
	}
]

//获取路由
function getRoutes() {
	createRoutes(routes)
	return routes
}
//递归生成路由 component
function createRoutes(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i].component) return
		//根据component 自动生成 path -> shop/goods/list
		let path = clearIndex(arr[i].component)
		arr[i].path = arr[i].path || `/${path}`
		//自动生成 name -> shop_goods_list
		//全局匹配 '/' 转换成 '_'
		arr[i].name = arr[i].name || path.replace(/\//g, '_')
		let component = import(`@/views/${arr[i].component}`)
		arr[i].component = () => component
		//递归
		if (arr[i].children && arr[i].children.length > 0) {
			createRoutes(arr[i].children)
		}
	}
}
//去除 index 因为 只要是 'index' 文件名就会自动找到
function clearIndex(str) {
	let index = str.lastIndexOf('/')
	//截取 最后一个 '/' 后面的 字符串
	let isIndex = str.substring(index + 1, str.length)
	//判断是否为 index 因为 index 会自动找到，如果是截取 '/' 前面的字符串 并返回 
	if (isIndex === 'index') {
		return str.substring(index, -1)
	}
	//如果不是 index 那就直接返回
	return str
}
export default getRoutes()
