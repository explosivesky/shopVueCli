<!--
 * @Author: your name
 * @Date: 2022-01-18 12:58:06
 * @LastEditTime: 2022-01-18 12:58:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\views\shop\goods\list.vue
-->
<template>
	<div class="bg-white px-4 position-absolute pt-2" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<search-box>
			<!-- 右边 -->
			<template #right>
				<div class="flex align-center">
					<el-date-picker
					      v-model="search.time"
					      type="daterange"
						  style="width: 380px;"
					      range-separator="至"
					      start-placeholder="开始日期"
					      end-placeholder="结束日期"
						  size="medium">
					    </el-date-picker>
						<el-input v-model="search.keyWord" placeholder="请输入订单号" class="mx-2" style="width: 150px;" size="medium"></el-input>
						<el-button type="info" size="medium">搜索</el-button>
				</div>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="700" border style="width: 100%" class="mt-2 pb-1" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column label="订单编号" prop="order" show-overflow-tooltip></el-table-column>
			<el-table-column label="用户名" align="center" prop="username" show-overflow-tooltip></el-table-column>
			<el-table-column label="开票金额" align="center" prop="price" show-overflow-tooltip></el-table-column>
			<el-table-column label="抬头" align="center" prop="price" show-overflow-tooltip></el-table-column>
			<el-table-column label="发票内容" align="center" prop="value" show-overflow-tooltip></el-table-column>
			<el-table-column label="纳税人识别号" align="center" prop="code" show-overflow-tooltip></el-table-column>
			<el-table-column label="创建时间" align="center" prop="create_time" show-overflow-tooltip></el-table-column>
			<el-table-column label="操作" align="center" show-overflow-tooltip></el-table-column>
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
			tableData: [
			],
			multipleSelection: [],
			currentPage: 0,
			search:{
				time:'',
				keyWord:'',
			}
		};
	},
	created() {},
	methods: {
		// 当选择项发生变化时会触发该事件
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		//当前项改变时触发
		handleCurrentChange() {},
		//size 发生变化时触发
		handleSizeChange() {},
	},
	components: {
		searchBox
	},
	computed: {
	}
};
</script>

<style scoped="scoped">
</style>
