/*
 * @Author: your name
 * @Date: 2022-01-19 15:34:56
 * @LastEditTime: 2022-01-19 17:18:42
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopvuecli\src\common\config\data.js
 */
export default {
	logo:'UNI-ADMIN',
	navBarItemList: {
		activeIndex: '0',
		list: [
			{
				title: '首页',
				subActiveIndex: '0',
				itemList: [
					{
						name: '后台首页',
						icon: 'el-icon-s-home',
                        router_name:'index'
					},
					{
						name: '商品列表',
						icon: 'el-icon-s-claim',
                        router_name:'shop_goods_list'
					},
					{
						name:'相册管理',
						icon:'el-icon-picture-outline',
						router_name:'imageManage'
					}
				]
			},
			{
				title: '商品',
				subActiveIndex: '0',
				itemList: [
					{
						name: '商品列表',
						icon: 'el-icon-s-claim',
                        router_name:'shop_goods_list'
					}
				]
			},
			{
				title: '订单'
			},
			{
				title: '会员'
			},
			{
				title: '设置'
			}
		]
	}
}