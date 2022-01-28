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
	<div class="bg-white px-4 position-absolute" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<!-- tabs标签页 -->
		<el-tabs v-model="tableIndex" @tab-click="handleClick">
			<el-tab-pane :label="t.name" v-for="(t, t_i) in tabTitleList" :key="t_i">
				<search-box placeholder="要搜索的商品名称" @search="search">
					<!-- 左边 -->
					<template #left>
						<div style="width: 740px;">
							<router-link :to="{name:'shop_goods_create'}"><el-button type="success" class="mr-2" size="mini">发布商品</el-button></router-link>
							<el-button type="warning" class="mr-2" size="mini">恢复商品</el-button>
							<el-button type="danger" class="mr-2" size="mini">批量删除</el-button>
							<el-button class="mr-2" size="mini">上架</el-button>
							<el-button class="mr-2" size="mini">下架</el-button>
							<el-button class="mr-2" size="mini">推荐</el-button>
						</div>
					</template>
					<!-- 右边 -->
					<template #default></template>
					<template #form>
						<!-- form表单 -->
						<el-form :inline="true" :model="searchForm" class="demo-form-inline px-4 flex justify-between" size="mini">
							<el-form-item label="商品名称"><el-input v-model="searchForm.shopName" placeholder="商品名称"></el-input></el-form-item>
							<el-form-item label="商品编号"><el-input v-model="searchForm.shopCode" placeholder="商品编号"></el-input></el-form-item>
							<el-form-item label="商品类型">
								<el-select v-model="searchForm.shopTypes" placeholder="请选择商品类型">
									<el-option :value="s.value" v-for="s in searchForm.shopTypeList" :key="s.value"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="商品分类"><el-input v-model="searchForm.shopCategory" placeholder="商品分类"></el-input></el-form-item>
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
					:data="tableData[t_i].list"
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
									<p class="mb-1">分类: {{ scope.row.category }}</p>
									<p class="mb-1">时间: {{ scope.row.create_time }}</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="商品类型" align="center" prop="type"></el-table-column>
					<el-table-column prop="order" align="center" label="商品排序" show-overflow-tooltip></el-table-column>
					<el-table-column label="商品状态" width="140" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button type="success" size="mini">上架</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="stock" label="总库存" align="center" show-overflow-tooltip></el-table-column>
					<el-table-column prop="pprice" align="center" label="价格(元)" show-overflow-tooltip></el-table-column>
					<el-table-column prop="ischeck" align="center" width="140" label="操作" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="primary" plain size="mini">修改</el-button>
								<el-button type="danger" plain size="mini" @click="deleteItem(scope.$index)">删除</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
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
					:current-page="currentPage"
					:page-sizes="[100, 200, 300, 400]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="400"
				></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox.vue';
export default {
	data() {
		return {
			tableIndex: 0,
			isShow: false,
			searchForm: {
				shopName: '',
				shopCode: '',
				shopTypes: '',
				shopTypeList: [
					{
						value: '类型一'
					},
					{
						value: '类型二'
					}
				],
				shopCategory: ''
			},
			tabTitleList: [
				{
					name: '审核中'
				},
				{
					name: '出售中'
				},
				{
					name: '已下架'
				},
				{
					name: '库存预警'
				},
				{
					name: '回收站'
				}
			],
			tableData: [],
			multipleSelection: [],
			currentPage:0
		};
	},
	created() {
		this.__getData();
	},
	methods: {
		__getData() {
			for (let i = 0; i < this.tabTitleList.length; i++) {
				this.tableData.push({
					creentPage: 1,
					list: []
				});
				for (let j = 0; j < 11; j++) {
					this.tableData[i].list.push({
						id: 1,
						title: '荣耀 V10全网通 标配版 4GB+64GB 魅丽红' + i + '-' + j,
						cover: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
						create_time: '2019-07-17 18:34:14',
						category: '手机',
						type: '普通商品',
						sale_count: 20,
						order: 100,
						status: 1,
						stock: 200,
						pprice: 1000,
						ischeck: 1
						// 0未审核，1通过，2不通过
					});
				}
			}
		},
		handleClick() {
			console.log(this.activeName);
		},
		superSearch(boolean) {
			this.isShow = boolean;
		},
		//清空筛选条件
		clearForm() {
			this.isShow = false
				this.searchForm = {
					shopName: '',
					shopCode: '',
					shopTypes: '',
					shopTypeList: [
						{
							value: '类型一'
						},
						{
							value: '类型二'
						}
					],
					shopCategory: ''
				};
		},
		//搜索 || 高级搜索
		search(e) {
			//普通搜索
			if (typeof e === String) {
			}
			//高级搜索
		},
		// 当选择项发生变化时会触发该事件
		handleSelectionChange(val) {
			console.log(val);
		},
		//删除一项列表
		deleteItem(index) {
			this.tableData[this.tableIndex].list.splice(index, 1);
		},
		//当前项改变时触发
		handleCurrentChange(){
			
		},
		//size 发生变化时触发
		handleSizeChange(){
			
		}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
