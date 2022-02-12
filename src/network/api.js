let admin = '/admin/'
class Url {
	static m(params, query = '') {
		let login = `${admin}login`
		let logout = `${admin}logout`
		let imageclass = params ? `${admin}imageclass/${params}` : `${admin}imageclass`
		let image = params ? `${admin}image/${params}` : `${admin}image`
		let delete_all = `${admin}image/delete_all`
		let upload = `${admin}image/upload`
		let category = params ? `${admin}category/${params}` : `${admin}category`
		let update_status = `${admin}category/${params}/update_status`
		let sort = `${admin}category/sort`
		let sku = {
			init: `${admin}skus/${params}${query}`, //获取商品规格列表的分页数据
			add_or_edit: params ? `${admin}skus/${params}` : `${admin}skus`, //增加商品规格|修改商品规格
			update_status: `${admin}skus/${params}/update_status`,
			delete: `${admin}skus/${params}/delete`,
			delete_all: `${admin}skus/delete_all`
		}
		let goods_type = {
			init: `${admin}goods_type/${params}${query}`,
			add_or_edit: params ? `${admin}goods_type/${params}` : `${admin}goods_type`,
			update_status: `${admin}goods_type/${params}/update_status`,
			delete: `${admin}goods_type/${params}/delete`,
			delete_all: `${admin}goods_type/delete_all`
		}
		let goods_comment = {
			init: `${admin}goods_comment/${params}${query}`,
			update_status: `${admin}goods_comment/${params}/update_status`,
			review: `${admin}goods_comment/review/${params}`
		}
		let user = {
			init: `${admin}user/${params}${query}`,
			add_or_edit: params ? `${admin}user/${params}` : `${admin}user`,
			update_status: `${admin}user/${params}/update_status`,
			delete: `${admin}user/${params}/delete`,
		}
		let user_level = {
			init: `${admin}user_level/${params}${query}`,
			add_or_edit: params ? `${admin}user_level/${params}` : `${admin}user_level`,
			update_status: `${admin}user_level/${params}/update_status`,
			delete: `${admin}user_level/${params}/delete`,
		}
		let order = {
			init: `${admin}order/${params}${query}`,
			ship: `${admin}order/${params}/ship`, //订单发货
			handle_refund: `${admin}order/${params}/handle_refund`, //拒绝/同意退款
			excelexport: `${admin}order/excelexport${query}`, //导出订单
			delete_all: `${admin}order/delete_all`
		}
		let express_company = `${admin}express_company/${params}${query}`
		let manager = {
			init: `${admin}manager/${params}${query}`,
			add_or_edit: params ? `${admin}manager/${params}` : `${admin}manager`,
			update_status: `${admin}manager/${params}/update_status`,
			delete: `${admin}manager/${params}/delete`,
		}
		let role = {
			init: `${admin}role/${params}${query}`,
			add_or_edit: params ? `${admin}role/${params}` : `${admin}role`,
			update_status: `${admin}role/${params}/update_status`,
			delete: `${admin}role/${params}/delete`,
			set_rules: `${admin}role/set_rules` //给角色配置权限
		}
		let rule = {
			init: `${admin}rule/${params}`,
			add_or_edit: params ? `${admin}rule/${params}` : `${admin}rule`,
			update_status: `${admin}rule/${params}/update_status`,
			delete: `${admin}rule/${params}/delete`,
		}
		let sysconfig = {
			init: `${admin}sysconfig`,
			upload: `${admin}sysconfig/upload`,
		}

		let goods = {
			init: `${admin}goods/${params}${query}`, //获取商品规格列表的分页数据
			add_or_edit: params ? `${admin}goods/${params}` : `${admin}goods`, //增加商品规格|修改商品规格
			delete: `${admin}goods/${params}/delete`,
			delete_all: `${admin}goods/delete_all`,
			changestatus: `${admin}goods/changestatus`, //批量上架/下架商品
			restore: `${admin}goods/restore`, //批量恢复商品
			destroy: `${admin}goods/destroy`, //彻底删除商品
			check: `${admin}goods/${params}/check`, //审核商品
			attrs: `${admin}goods/attrs/${params}`, //设置商品属性
			banners: `${admin}goods/banners/${params}`, //媒体设置
			read: `${admin}goods/read/${params}`, //查看商品资料
			updateskus: `${admin}goods/updateskus/${params}`, //设置商品规格
			create: `${admin}goods/create`, //其他参数


		}
		let goods_skus_card = {
			add_or_edit: params ? `${admin}goods_skus_card/${params}` : `${admin}goods_skus_card`, //修改商品规格卡片属性
			delete: `${admin}goods_skus_card/${params}/delete`,
			sort: `${admin}goods_skus_card/sort`,

		}
		let goods_skus_card_value = {
			add_or_edit: params ? `${admin}goods_skus_card_value/${params}` : `${admin}goods_skus_card_value`,
			delete: `${admin}goods_skus_card_value/${params}/delete`,
			sort: `${admin}goods_skus_card_value/sort`,
		}
		let express = {
			init: `${admin}express/${params}${query}`,
			add_or_edit: params ? `${admin}express/${params}` : `${admin}express`,
			delete: `${admin}express/${params}/delete`,
		}
		let express_value = {
			add_or_edit: params ? `${admin}express_value/${params}` : `${admin}express_value`,
			delete: `${admin}express_value/${params}/delete`,
		}
		return {
			login,
			logout,
			imageclass,
			image,
			delete_all,
			upload,
			category,
			update_status,
			sort,
			sku,
			goods_type,
			goods_comment,
			user,
			user_level,
			order,
			express_company,
			manager,
			role,
			rule,
			sysconfig,
			goods,
			goods_skus_card,
			goods_skus_card_value,
			express,
			express_value
		}
	}
}
export default Url
