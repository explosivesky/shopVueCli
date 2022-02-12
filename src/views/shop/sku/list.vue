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
	<div class="bg-white px-4 position-absolute pt-2" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<search-box :noShow="false">
			<!-- 左边 -->
			<template #left>
				<div style="width: 740px;">
					<el-button type="success" class="mr-2" size="mini" @click="openRulesDialog(false)">添加规格</el-button>
					<el-button type="danger" class="mr-2" size="mini" @click="deleteSku('all')">批量删除</el-button>
				</div>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="700" border style="width: 100%" class="mt-2 pb-1" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column label="规格名称" prop="name" width="385" show-overflow-tooltip></el-table-column>
			<el-table-column label="规格值" align="center" prop="default"></el-table-column>
			<el-table-column prop="order" align="center" label="排序" show-overflow-tooltip></el-table-column>
			<el-table-column label="状态" width="140" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'warning' : 'success'" size="mini" @click="isBan(scope.row)">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="ischeck" align="center" width="140" label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="primary" plain size="mini" @click="openRulesDialog(scope)">修改</el-button>
						<el-button type="danger" plain size="mini" @click="deleteSku('single', scope.row.id)">删除</el-button>
					</el-button-group>
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
		<el-dialog title="添加规格" :visible.sync="createModel" :modal="false" width="60%">
			<el-form ref="form" :model="form" label-width="80px" :rules="rules">
				<el-form-item label="规格名称" prop="name"><el-input v-model="form.name" placeholder="规格名称" style="width: 150px;"></el-input></el-form-item>
				<el-form-item label="排序"><el-input-number v-model="form.order" :min="1" :max="2147483647"></el-input-number></el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status">
						<el-radio :label="0" border>启用</el-radio>
						<el-radio :label="1" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="类型">
					<el-radio-group v-model="form.type">
						<el-radio :label="0" border>文字</el-radio>
						<el-radio :label="1" border>颜色</el-radio>
						<el-radio :label="2" border>图片</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="规格值" prop="default">
					<el-input v-model="form.default" type="textarea" size="mini" placeholder="一行为一个规格项,多个规格项用换行输入"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="ruleFn">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox.vue';
import mixin from '@/common/mixins';
export default {
	inject: ['layout'],
	mixins: [mixin],
	data() {
		return {
			isShow: false,
			form: {
				id: 0,
				name: '',
				order: 0,
				status: 0,
				type: 0,
				default: ''
			},
			tableData: [],
			createModel: false,
			rules: {
				name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }],
				default: [{ required: true, message: '规格值不能为空', trigger: 'blur' }]
			},
			dynamicUrl: 'sku'
		};
	},
	methods: {
		getMixinList(e) {
			this.tableData = e.list;
		},
		//打开规格dialog
		openRulesDialog(e) {
			//新建
			if (e == false) {
				this.currentIndex = -1;
				this.form = {
					name: '加妹妹微信18569632331',
					order: 2147483647,
					status: 0,
					type: 0,
					default: '上门服务'
				};
			} else {
				//修改页面的 初始值
				this.form = {
					...e.row,
					default: e.row.default.replace(/,/g, '\n')
				};
				//根据currentindex 判断是 添加表格 | 修改表格
				this.currentIndex = e.$index;
			}
			this.createModel = true;
		},
		//dialog确定
		ruleFn(e) {
			this.$refs.form.validate(res => {
				if (!res) return;
				let id = 0;
				this.form.default = this.form.default.replace(/\n/g, ',');
				if (this.currentIndex !== -1) {
					//修改表格
					id = this.tableData[this.currentIndex].id;
				}
				this.addOrEdit(this.form,id);
			});
		}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
