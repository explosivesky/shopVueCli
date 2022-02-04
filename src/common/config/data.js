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
					},
					{
						name: '商品规格',
						icon: 'el-icon-mobile',
					    router_name:'shop_sku_list'
					},
					{
						name: '分类列表',
						icon: 'el-icon-s-help',
					    router_name:'shop_category_list'
					},
					{
						name: '商品类型',
						icon: 'el-icon-money',
					    router_name:'shop_type_list'
					},
					{
						name: '商品评论',
						icon: 'el-icon-money',
					    router_name:'shop_comment_list'
					},
				
				]
			},
			{
				title: '订单',
				subActiveIndex: '0',
				itemList: [
					{
						name: '订单管理',
						icon: 'el-icon-s-home',
					    router_name:'order_order_list'
					},
					{
						name: '发票管理',
						icon: 'el-icon-s-home',
				        router_name:'order_invoice_list'
					},
					{
						name: '售后服务',
						icon: 'el-icon-s-home',
					    router_name:'order_afterService_list'
					}
				]
			},
			{
				title: '会员',
				subActiveIndex: '0',
				itemList: [
					{
						name: '会员列表',
						icon: 'el-icon-s-home',
					    router_name:'vip_vipList_list'
					},
					{
						name: '会员等级',
						icon: 'el-icon-s-home',
				        router_name:'vip_vipLevel_list'
					}
				]
			},
			{
				title: '设置',
				subActiveIndex: '0',
				itemList: [
					{
						name: '基础设置',
						icon: 'el-icon-setting',
					    router_name:'setter_baseSet'
					},
					{
						name: '物流设置',
						icon: 'el-icon-setting',
					    router_name:'setter_express'
					},
					{
						name: '管理员管理设置',
						icon: 'el-icon-setting',
					    router_name:'setter_manager'
					},
					{
						name: '交易设置',
						icon: 'el-icon-setting',
					    router_name:'setter_payment'
					}
				]
			}
		]
	}
}