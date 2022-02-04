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
					<el-button type="danger" class="mr-2" size="mini" @click="deleteAll">批量删除</el-button>
				</div>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="700" border style="width: 100%" class="mt-2 pb-1" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column label="规格名称" prop="name" width="385" show-overflow-tooltip></el-table-column>
			<el-table-column label="规格值" align="center" prop="value"></el-table-column>
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
						<el-button type="danger" plain size="mini" @click="deleteItem(scope.$index)">删除</el-button>
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
					:current-page="currentPage"
					:page-sizes="[100, 200, 300, 400]"
					:page-size="100"
					layout="total, sizes, prev, pager, next, jumper"
					:total="400"
				></el-pagination>
			</div>
		</div>
		<el-dialog title="添加规格" :visible.sync="createModel" :modal="false" width="60%">
			<el-form ref="form" :model="form" label-width="80px" :rules="rules">
				<el-form-item label="规格名称" prop="name"><el-input v-model="form.name" placeholder="规格名称" style="width: 150px;"></el-input></el-form-item>
				<el-form-item label="排序"><el-input-number v-model="form.order" @change="handleChange" :min="1" :max="50"></el-input-number></el-form-item>
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
				<el-form-item label="规格值" prop="value">
					<el-input v-model="form.value" type="textarea" size="mini" placeholder="一行为一个规格项,多个规格项用换行输入"></el-input>
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
export default {
	data() {
		return {
			isShow: false,
			form: {
				name: '',
				order: 0,
				status: 0,
				type: 0,
				value: ''
			},
			tableData: [
				{
					id: 0,
					name: '颜色',
					value: '棕色,蓝色',
					order: 50,
					status: 0,
					type: 0
				},
				{
					id: 1,
					name: '颜色',
					value: '棕色,蓝色',
					order: 50,
					status: 0,
					type: 0
				}
			],
			multipleSelection: [],
			currentPage: 0,
			createModel: false,
			rules: {
				name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }],
				value: [{ required: true, message: '规格值不能为空', trigger: 'blur' }]
			},
			currentIndex: -1
		};
	},
	created() {},
	methods: {
		//是否禁用
		isBan(item) {
			this.$message({ type: 'success', message: item.status ? '启用' : '禁用' });
			item.status = item.status == 1 ? 0 : 1;
		},
		//打开规格dialog
		openRulesDialog(e) {
			//新建
			if (e == false) {
				this.form = {
					name: '',
					order: 0,
					status: 0,
					type: 0,
					value: ''
				};
			} else {
				//修改页面的 初始值
				this.form={
					...e.row,
					value:e.row.value.replace(/,/g, '\n')
				}
				// let item = this.form;
				// item.name = e.row.name;
				// item.order = e.row.order;
				// item.status = e.row.status;
				// item.type = e.row.type;
				// item.value = e.row.value.replace(/,/g, '\n');
				//根据currentindex 判断是 添加表格 | 修改表格
				this.currentIndex = e.$index;
			}
			this.createModel = true;
		},
		//关闭规格dialog
		closeRulesDialog() {
			this.createModel = false;
		},
		//dialog确定
		ruleFn(e) {
			this.$refs.form.validate(res => {
				if (!res) return;
				let msg = '添加';
				if (this.currentIndex == -1) {
					//添加表格
					this.form.value = this.form.value.replace(/\n/g, ',');
					this.tableData.unshift(this.form);
					this.form = {
						id: 5,
						name: '',
						order: 0,
						status: 0,
						type: 0,
						value: ''
					};
				} else {
					//修改表格
					//！！！ 一定要让这个 item 引用 this.batleData 的内存地址，否侧不生效
					let item = this.tableData[this.currentIndex];
					item.name = this.form.name;
					item.order = this.form.order;
					item.status = this.form.status;
					item.type = this.form.type;
					item.value = this.form.value.replace(/\n/g, ',');
					msg = '修改';
					this.currentIndex = -1;
				}

				this.closeRulesDialog();
				this.$message.success(msg + '成功');
			});
		},
		//批量删除
		deleteAll() {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let index;
				this.multipleSelection.forEach(i => {
					index = this.tableData.findIndex(v => v.id == i.id);
					if (index !== -1) this.tableData.splice(index, 1);
				});
				this.$message.success('删除成功!');
			});
		},
		handleClick() {
			console.log(this.activeName);
		},
		superSearch(boolean) {
			this.isShow = boolean;
		},
		// 当选择项发生变化时会触发该事件
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		//删除一项列表
		deleteItem(index) {
			this.tableData.splice(index, 1);
		},
		//当前项改变时触发
		handleCurrentChange() {},
		//size 发生变化时触发
		handleSizeChange() {},
		handleChange() {}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
