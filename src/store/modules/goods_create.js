/*
 * @Author: your name
 * @Date: 2022-01-23 20:08:00
 * @LastEditTime: 2022-01-24 19:25:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\store\modules\goods_create.js
 */
import $utils from '@/common/utils.js'
export default {
	namespace: 'goods',
	state: {
		rulesType: 0, //商品规格 0多规格 ： 1单规格 
		//基础设置
		name: '', //商品名称
		cate: '', //商品分类
		unit: '', //商品单位
		desc: '', //商品描述
		stock: 0, //总库存
		stockWarning: 0, //库存预警
		isShowStock: '', //库存显示 0是 ： 1否
		isSell: '', //是否上架  0放入仓库 ： 1立即上架
		//单个设置
		expense: '', //运费模板
		marketPri: 0, //市场价格
		sellPri: 0, //销售价格
		costPri: 0, //成本价格
		weight: 0, //商品重量
		bulk: 0, //商品体积
		//媒体设置
		banners:[{
			id:1,
			src:'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
		},
		{
			id:2,
			src:'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
		}],
		//sku
		skuList: [{
				name: '颜色', //规格项
				group: 0,
				type: 'default', // default 无 ： color 颜色 ： img 图片
				list: [{
						name: '红色',
						image: '',
						color: '',
						isShow: false,
						default: 'default0'
					},
					{
						name: '黄色',
						image: '',
						color: '',
						isShow: false,
						default: 'default1'
					}
				]

			},
			{
				name: '尺寸', //规格项
				group: 1,
				type: 'default', // default 无 ： color 颜色 ： img 图片
				list: [{
						name: 'XL',
						image: '',
						color: '',
						isShow: false,
						default: 'default2'
					},
					{
						name: 'XXL',
						image: '',
						color: '',
						isShow: false,
						default: 'default3'
					}
				]

			}
		],
		'default': 4, //ref
		group: 2,
		// 表头
		ths: [{
				name: "商品规格",
				rowspan: 1,
				colspan: 1,
				width: ""
			},
			{
				name: "sku图片",
				rowspan: 2,
				width: "80"
			},
			{
				name: "销售价",
				rowspan: 2,
				width: "100"
			},
			{
				name: "市场价",
				rowspan: 2,
				width: "100"
			},
			{
				name: "成本价",
				rowspan: 2,
				width: "100"
			},
			{
				name: "库存",
				rowspan: 2,
				width: "100"
			},
			{
				name: "体积",
				rowspan: 2,
				width: "100"
			},
			{
				name: "重量",
				rowspan: 2,
				width: "100"
			},
			{
				name: "编码",
				rowspan: 2,
				width: "100"
			},
		],
		//商品属性页
		goodsType:'',//商品类型
		goodsAttr:{//商品属性
			type:''
		},
		//折扣
		vipPrice:0,
	},
	getters: {
		//生成表头
		getThs(state,geeter) {
			let length =geeter.getLable.length
			state.ths[0].rowspan = length > 0 ? 1 : 2
			state.ths[0].colspan = length
			return state.ths
		},
		//获取第二个 th 标签数据
		getLable(state){
			 return state.skuList.filter(i=>{
				//返回 有list 数据的
				return i.list.length > 0
			})
		}
		,
		//生成表数据 和 sku th
		getThsData(state) {
			if (state.skuList.length == 0) return []
			let skuList = []
			//最终 skulist 就是个 二维数组形式
			for (let i = 0; i < state.skuList.length; i++) {
				if (state.skuList[i].list.length > 0) {
					skuList.push(state.skuList[i].list)
				}
			}
			if (skuList.length == 0) return []
			let arr = $utils.skuComputed(...skuList)
			return arr.map(v => {
				//表格 的默认值
				let obj = {
					skus: [],
					image: "", // sku图片
					pprice: 0, // 销售价格
					oprice: 0, // 市场价格
					cprice: 0, // 成本价格
					stock: 0,//库存
					volume: 0,//体积
					weight: 0,//重量
					code: ''//编码
				}
				//生成 sku 的表格的 th 
				obj.skus=v
				return obj
			})
			 
		}
	},
	mutations: {
		//修改state
		vModelState(state, {
			key,
			val
		}) {
			console.log(key,
			val)
			state[key] = val
		},
		//增加规格卡片
		skuAdd(state) {
			state.skuList.push({
				name: '颜色', //规格项
				group: state.group++,
				type: 'default', // default 无 ： color 颜色 ： img 图片
				list: [{
						name: '红色',
						image: '',
						color: '',
						isShow: false,
						default: 'default0'
					},
					{
						name: '黄色',
						image: '',
						color: '',
						isShow: false,
						default: 'default1'
					}
				]

			})
		},
		//删除规格卡片
		skuDelete(state, index) {
			state.skuList.splice(index, 1)
		},
		//绑定规格卡片
		vModelSku(state, {
			key,
			val,
			index
		}) {
			console.log(	key,
			val,
			index)
			state.skuList[index][key] = val
		},
		//排序规格卡片
		sortSku(state, {
			type,
			arr,
			index
		}) {
			$utils[type](arr, index)
		},
		//添加规格项
		addRuleItem(state, {
			type,
			index
		}) {
			state.skuList[index].list.push({
				name: '规格名称',
				color: '',
				img: '',
				isShow: false,
				default: 'default' + state.default++
			})
		},
		//控制每个 规格项 显示
		editIsShow(state, {
			index,
			subIndex
		}) {
			state.skuList[index].list[subIndex].isShow = !state.skuList[index].list[subIndex].isShow
		},
		//删除card 中的 子按钮
		delItem(state, {
			subIndex,
			index
		}) {
			state.skuList[index].list.splice(subIndex, 1)
		},
		//card 子按钮 排序
		sortCardItem(state, {
			index,
			arr
		}) {
			state.skuList[index].list = arr
		},
		//更新规格项的 input 框
		updateIpt(state, {
			index,
			subIndex,
			val,
			type
		}) {
			state.skuList[index].list[subIndex][type] = val
		},
		//更改商品属性
		vModelGoodsAttr(state,{key,val}){
			state.goodsAttr[key]=val
		}
	},
	actions: {

	}
}
