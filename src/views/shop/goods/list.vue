<!--
 * @Author: your name
 * @Date: 2022-01-18 12:58:06
 * @LastEditTime: 2022-01-18 12:58:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\views\shop\goods\list.vue
-->
<template>
	<!-- <div class="position-absolute bg-white" style="top: 55px;"> -->
	<div class="bg-white px-4 position-absolute mt-3" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<!-- tabs标签页 -->
		<el-tabs v-model="tableIndex" @tab-click="__init">
			<el-tab-pane :label="t.name" v-for="(t, t_i) in tabTitleList" :key="t_i">
			</el-tab-pane>
		</el-tabs>
		<search-box placeholder="要搜索的商品名称" @search="search">
			<!-- 左边 -->
			<template #left>
				<div style="width: 740px;">
					<router-link :to="{name:'shop_goods_create'}"><el-button type="success" class="mr-2" size="mini">发布商品</el-button></router-link>
					<el-button type="warning" class="mr-2" size="mini" v-if="tab==='delete'" @click="handler('restore')">恢复商品</el-button>
					<el-button type="danger" class="mr-2" size="mini" v-if="tab!=='delete'" @click="handler('destroy')">彻底删除</el-button>
					<el-button type="danger" class="mr-2" size="mini" v-if="tab!=='delete'" @click="deleteSku('all')">批量删除</el-button>
					<el-button class="mr-2" size="mini" v-if="tab==='all' || tab==='off'" @click="upOrDown(1)">上架</el-button>
					<el-button class="mr-2" size="mini" v-if="tab==='all' || tab==='saling'" @click="upOrDown(0)">下架</el-button>
				</div>
			</template>
			<!-- 右边 -->
			<template #default></template>
			<template #form>
				<!-- form表单 -->
				<el-form :inline="true" :model="form" class="demo-form-inline px-4 flex justify-between" size="mini">
					<el-form-item label="商品名称"><el-input v-model="form.title" placeholder="商品名称"></el-input></el-form-item>
					<el-form-item label="商品分类">
						<el-select v-model="form.category_id" placeholder="请选择商品分类">
							<el-option :value="item.category_id" :label="item | tree" v-for="item in categoryList" :key="item.id"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<!-- 按钮组 -->
				<el-button-group>
					<el-button type="info" class="mr-2" size="mini" @click="search">搜索</el-button>
					<el-button size="mini" @click="clearForm">清空筛选条件</el-button>
				</el-button-group>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table
			ref="multipleTable"
			:data="tableData"
			tooltip-effect="dark"
			height="700"
			border
			style="width: 100%"
			class="mt-4 pb-1"
			@selection-change="handleSelectionChange"
		>
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column label="商品信息" width="385" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="media">
						<img :src="scope.row.cover" class="mr-3" style="width: 70px; height: 80px; " />
						<div class="media-body">
							<p class="mb-1">{{ scope.row.title }}</p>
							<p class="mb-1">分类: {{ scope.row.category.name }}</p>
							<p class="mb-1">时间: {{ scope.row.create_time }}</p>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="商品状态" width="80" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span class="badge" :class="scope.row.status ? 'badge-success' : 'badge-danger'">{{scope.row.status ? '上架' :'在仓'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="审核状态" width="190" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div class="" v-if="!scope.row.ischeck">
						<el-button type="success" plain size="mini" @click="isCheck(scope.row.id,1)">审核通过</el-button>	
						<el-button type="danger" plain size="mini" @click="isCheck(scope.row.id,2)">拒绝通过</el-button>	
					</div>
					<span v-else>{{scope.row.ischeck ==1 ? '已通过' : '已拒绝'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="stock" label="总库存" width="80" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column align="center" width="150" label="价格(元)" show-overflow-tooltip>
				<template slot-scope="scope">
					<span class="text-danger">￥{{scope.row.min_oprice}}</span>
					<span class="text-muted">/</span>
					<span class="text-muted">￥{{scope.row.min_price}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
						<div>
							<el-button type="text" size="mini" @click="navgate('shop_goods_create',scope.row.id)">基础设置</el-button>
							<el-button type="text" size="mini" @click="navgate('shop_goods_sku',scope.row.id)" :class="(scope.row.sku_type == 0 && !scope.row.sku_value) || (scope.row.sku_type == 1 && !scope.row.goods_skus.length) ? 'text-danger' : ''">基础规格</el-button>
							<el-button type="text" size="mini" @click="navgate('shop_goods_attr',scope.row.id)">基础属性</el-button>
							<el-button type="text" size="mini" :class="scope.row.goods_banner.length ? '': 'text-danger'" @click="navgate('shop_goods_banner',scope.row.id)">媒体设置</el-button>
						</div>
						<el-button :class="scope.row.content ? '': 'text-danger'" type="text" size="mini" @click="navgate('shop_goods_content',scope.row.id)">商品详情</el-button>
						<el-button type="text" size="mini">折扣设置</el-button>
						<el-button type="text" size="mini" @click="deleteSku('single',scope.row.id)">删除商品</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="position-fixed bg-white flex" style="bottom: 0; left: 200px; right: 0; height: 60px; z-index: 9;">
			<div class="border-right flex align-center justify-center" style="width: 200px;">
				<el-button-group>
					<el-button class="mr-2" size="mini">上一页</el-button>
					<el-button size="mini">下一页</el-button>
				</el-button-group>
			</div>
			<div class="pl-2 flex align-center">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="page.currentPage"
					:page-sizes="page.pageSizes"
					:page-size="page.pageSize"
					layout="total, sizes, prev, pager, next, jumper"
					:total="page.total"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox.vue';
import mixin from '@/common/mixins'
export default {
	inject:['layout'],
	mixins:[mixin],
	data() {
		return {
			tableIndex: 0,
			form: {
				title: '',
				category_id: 0,
			},
			categoryList: [],
			tabTitleList: [
				{
					name: '全部',
					key:'all'
				},
				{
					name: '审核中',
					key:'checking'
				},
				{
					name: '出售中',
					key:'saling'
				},
				{
					name: '已下架',
					key:'off'
				},
				{
					name: '库存预警',
					key:'min_stock'
				},
				{
					name: '回收站',
					key:'delete'
				}
			],
			tableData: [],
			dynamicUrl:'goods',
			
		};
	},
	filters:{
		tree(item){
			if(!item)return
			let str = ''
			if(item.level==0) return item.name
				for (var i = 0; i < item.level; i++) {
					str += i == 0 ? '|--' : '--'
				}
			return str + ' ' + item.name
		}
	},
	computed:{
		tab(){
			return this.tabTitleList[this.tableIndex].key
		},
		params(){
			let str = ''
			for (let key in this.form) {
				let val = this.form[key]
				if(val)str += `&${key}=${this.form[key]}`
			}
			return str
		}
	},
	methods: {
		//商品审核
		isCheck(id,ischeck){
			this.layout.isLoading(true)
			new this.request(this.url.m(id).goods.check,{ischeck}).modepost().then(res=>{
				this.__init()
				this.$message.success('操作成功')
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		editUrlVal() {
			//组件中没写这个方法 则不会覆盖
			return  `/admin/${this.dynamicUrl}/${this.page.currentPage}?limit=${this.page.pageSize}&tab=${this.tab}${this.params}`
		},
		getMixinList(data) {
			this.tableData=data.list
			this.categoryList=data.cates
		},
		//清空筛选条件
		clearForm() {
			this.form.title= ''
			this.form.category_id=0 
		},
		//搜索/高级搜索
		search(e) {
			//普通搜索
			if (typeof e === 'string') {
				this.form.title=e
			}
			this.__init()
		},
		//彻底删除/恢复商品
		handler(type){
			this.layout.isLoading(true)
			new this.request(this.url.m().goods[type],{ids:this.ids}).modepost().then(res=>{
				this.__init()
				this.$message.success('操作成功')
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		// 上架/下架
		upOrDown(status){
			this.layout.isLoading(true)
			new this.request(this.url.m().goods.changestatus,{ids:this.ids,status}).modepost().then(res=>{
				this.__init()
				this.$message.success('操作成功')
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		navgate(name,id){
			this.$router.push({name,params:{id}})
		}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
