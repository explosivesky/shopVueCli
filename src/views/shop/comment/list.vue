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
	<div class="bg-white px-2 position-absolute" style="top: 55px; right: 0; bottom: 0; left: 0;">
				<search-box placeholder="要搜索的商品名称" @search="search" class="pt-2">
					<!-- 左边 -->
					<template #left>
						<div style="width: 740px;">
							<el-button type="danger" class="mr-2" size="mini">批量删除</el-button>
						</div>
					</template>
					<!-- 右边 -->
					<template #right></template>
					<template #form>
						<!-- form表单 -->
						<el-form :inline="true" :model="searchForm" class="demo-form-inline px-4 flex justify-between" size="mini">
							<el-form-item label="用户评价"><el-input v-model="searchForm.shopName" placeholder="用户评价"></el-input></el-form-item>
							<el-form-item label="评价类型"><el-input v-model="searchForm.shopCode" placeholder="评价类型"></el-input></el-form-item>
							<el-form-item label="发布时间">
									  <el-date-picker
									      v-model="date"
									      type="daterange"
									      range-separator="至"
									      start-placeholder="开始日期"
									      end-placeholder="结束日期">
									    </el-date-picker>
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
					:data="tableData"
					tooltip-effect="dark"
					height="700"
					border
					style="width: 100%"
					class="mt-2 pb-1"
					@selection-change="handleSelectionChange"
				>
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" type="expand" width="55">
						<div class="media px-5">
						 <img src="http://static.yoshop.xany6.com/2018071718294208f086786.jpg" class="mr-3 img-cover border" style="width: 60px; height: 60px; border-radius: 100%;" />
						  <div class="media-body">
						    <div class="flex justify-between">
						    	<h6 class="mt-0">用户名一 <small>2022-02-02</small></h6>
								<el-button type="danger" size="mini">删除</el-button>
						    </div>
							<p>评论内容</p>
						    <div class="media mt-3">
						       <img src="http://static.yoshop.xany6.com/2018071718294208f086786.jpg" class="mr-3 img-cover border" style="width: 60px; height: 60px; border-radius: 100%" />
						      <div class="media-body">
								  <div class="flex justify-between">
								  	<h6 class="mt-0">客服一 <small>2022-02-02</small></h6>
								  	<el-button type="danger" size="mini">删除</el-button>
								  </div>
						        <p>回复内容</p>
						      </div>
						    </div>
						  </div>
						</div>
					</el-table-column>
					<el-table-column label="ID" align="center" prop="id" width="80"></el-table-column>
					<el-table-column label="商品" show-overflow-tooltip>
						<template slot-scope="scope">
							<div class="media">
								<img :src="scope.row.goods.cover" class="mr-3" style="width: 70px; height: 80px; " />
								<div class="media-body">
									<p class="mb-1">{{ scope.row.goods.title }}</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="left" label="评价信息" width="200" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>用户名 : {{scope.row.username}}</span>
							<div>
								评分 :
							</div>
							<el-rate
							  v-model="scope.row.star"
							  disabled
							  show-score
							  text-color="#ff9900"
							  score-template="{value}">
							</el-rate>
						</template>
					</el-table-column>
					<el-table-column prop="create_time" label="评价时间" width="180" align="center" show-overflow-tooltip>
						</el-table-column>
					<el-table-column prop="isShow" label="是否显示" width="140" align="center" show-overflow-tooltip>
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
			tableData: [{
				id:0,
				goods:{
					cover:'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
					title:'商品标题'
				},
				userName:'用户名',
				star:5,
				
			}],
			date:'',
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
