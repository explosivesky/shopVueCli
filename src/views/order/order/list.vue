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
							<el-button type="success" class="mr-2" size="mini">导出数据</el-button>
							<el-button type="danger" class="mr-2" size="mini">批量删除</el-button>
						</div>
					</template>
					<!-- 右边 -->
					<template #default></template>
					<template #form>
						<!-- form表单 -->
						<el-form :inline="true" :model="form" class="demo-form-inline px-4 flex flex-wrap" size="mini">
							<el-form-item label="订单编号"><el-input v-model="form.code" placeholder="订单编号"></el-input></el-form-item>
							<el-form-item label="订单状态">
								<el-select v-model="form.status" placeholder="请选择订单状态">
									<el-option :label="0" value="状态1"></el-option>
									<el-option :label="1" value="状态2"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="下单时间">
								<el-date-picker
								      v-model="form.time"
								      type="daterange"
									  style="width: 380px;"
								      range-separator="至"
								      start-placeholder="开始日期"
								      end-placeholder="结束日期"
									  size="mini">
								    </el-date-picker>
							</el-form-item>
							<el-form-item label="收货人"><el-input v-model="form.user" placeholder="收货人"></el-input></el-form-item>
							<el-form-item label="手机号" class="flex">
								<div class="flex">
									<el-input v-model="form.phone" placeholder="手机号"></el-input>
									<!-- 按钮组 -->
									<el-button-group class="flex ml-2">
										<el-button type="info" class="mr-2" size="mini" @click="search">搜索</el-button>
										<el-button size="mini" @click="clearForm">清空筛选条件</el-button>
									</el-button-group>
								</div>
							</el-form-item>
						</el-form>
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
					<el-table-column label="商品信息" width="325">
						<template slot-scope="scope">
							<div class="flex">
								<div class="flex-1">
									<p class="mb-1">订单编号:</p>
									<strong>212313213</strong>
								</div>
								<div class="flex-1">
									<p class="mb-1">下单时间:</p>
									<strong>2123-13-213</strong>
								</div>
							</div>
							<div class="media">
								<img :src="scope.row.cover" class="mr-3" style="width: 70px; height: 80px; " />
								<div class="media-body">
									<p class="mb-1 text-primary">{{ scope.row.title }}</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="实付款" align="center" prop="type" width="120px">
						<template slot-scope="scope">
							<p class="mb-1">￥ 10</p>
							<small>(含运费: ￥0.00)</small>
						</template>
					</el-table-column>
					<el-table-column prop="order" align="center" label="买家" width="120px">
						<template slot-scope="scope">
							<p class="mb-1">用户名</p>
							<small>(用户id: 11)</small>
						</template>
					</el-table-column>
					<el-table-column label="商品状态" width="140" align="center" show-overflow-tooltip>
						<p class="badge badge-success">微信支付</p>
					</el-table-column>
					<el-table-column prop="stock" label="配送方式" align="center" show-overflow-tooltip>
						<p>申通快递</p>
					</el-table-column>
					<el-table-column prop="pprice" align="center" label="交易状态" show-overflow-tooltip>
						<div class="">
							付款状态: <span class="badge badge-success">已付款</span>
						</div>
						<div class="">
							发货状态: <span class="badge badge-secondary">代发货</span>
						</div>
						<div class="">
							收货状态: <span class="badge badge-secondary">待收货</span>
						</div>
					</el-table-column>
					<el-table-column prop="ischeck" align="center" width="140" label="操作" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button-group>
								<el-button type="text" plain size="mini" class="hover px-2">订单详情</el-button>
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
			form: {
				code: '',
				status: '',
				time: '',
				user: '',
				phone: '',
			},
			tabTitleList: [
				{
					name: '全部'
				},
				{
					name: '待付款'
				},
				{
					name: '待收货'
				},
				{
					name: '已发货'
				},
				{
					name: '已收货'
				},
				{
					name: '已完成'
				},
				{
					name: '已关闭'
				},
				{
					name: '退款中'
				}
			],
			tableData: [{
						id: 1,
						title: '荣耀 V10全网通 标配版 4GB+64GB 魅丽红',
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
					}],
			multipleSelection: [],
			currentPage:0
		};
	},
	created() {
	},
	methods: {
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
			this.multipleSelection=val
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
