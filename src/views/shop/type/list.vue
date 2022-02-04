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
					<el-button type="success" class="mr-2" size="mini" @click="openRulesDialog(false)">添加类型</el-button>
					<el-button type="danger" class="mr-2" size="mini" @click="deleteAll">批量删除</el-button>
				</div>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="700" border style="width: 100%" class="mt-2 pb-1" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column label="类型名称" prop="name" width="385" show-overflow-tooltip></el-table-column>
			<el-table-column label="属性标签" align="center" prop="value">
				<template slot-scope="scope">
					{{ scope.row.dialogTableData | formatVal }}
				</template>
			</el-table-column>
			<el-table-column prop="order" align="center" label="属性排序" show-overflow-tooltip></el-table-column>
			<el-table-column label="状态" width="140" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'warning' : 'success'" size="mini" @click="isBan(scope.row)">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" width="140" label="操作" show-overflow-tooltip>
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
		<!-- dialog -->
		<el-dialog title="添加类型" :visible.sync="createModel" :modal="false" width="70%">
			<el-form ref="form" :model="form" label-width="80px" :rules="rules">
				<el-form-item label="类型名称" prop="name"><el-input v-model="form.name" size="mini" placeholder="类型名称" style="width: 150px;"></el-input></el-form-item>
				<el-form-item label="排序"><el-input-number v-model="form.order" @change="handleChange" size="mini" :min="1" :max="50"></el-input-number></el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.status">
						<el-radio :label="0" border size="mini">启用</el-radio>
						<el-radio :label="1" border size="mini">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="关联规格">
					<div class="flex">
						<span class="form-item-span flex border mt-2 rounded justify-center align-center" style="line-height: initial; width: 70px; height: 30px;">
							<font>颜色</font>
							<i class="el-icon-delete"></i>
						</span>
						<span
							class="form-item-span flex border mt-2 rounded justify-center align-center el-icon-plus"
							style="line-height: initial; width: 70px; height: 30px;"
						></span>
					</div>
				</el-form-item>
				<el-form-item label="属性列表" prop="value">
					<el-table :data="dialogTableData" style="width: 100%">
						<el-table-column prop="order" label="排序" width="80">
							<template slot-scope="scope">
								<el-input v-model="scope.row.order" type="number" size="mini"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="name" label="属性名称" width="150">
							<template slot-scope="scope">
								<el-input v-model="scope.row.name" size="mini"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="type" width="150" label="所属类型">
							<template slot-scope="scope">
								<el-select v-model="scope.row.type" size="mini" placeholder="请选择活动区域">
									<el-option label="输入框" value="input"></el-option>
									<el-option label="单选框" value="radio"></el-option>
									<el-option label="多选框" value="checkbox"></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column width="50" label="是否显示">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.isShow" :active-value="true" :inactive-value="false" @change="switchChange"></el-switch>
							</template>
						</el-table-column>
						<el-table-column prop="value" width="250" label="属性值">
							<template slot-scope="scope" v-if="scope.row.type !== 'input'">
								<el-input v-model="scope.row.value" type="textarea" v-if="!scope.row.isEdit"></el-input>
								<span v-else>{{ scope.row.value | toN }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" width="150">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click="done(scope)" v-if="showArea(scope, false)">{{ showArea(scope, true) }}</el-button>
								<el-button type="text" size="mini" @click="dialogDeleteItem(scope)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<el-button type="text" class="el-icon-plus" @click="addAttr">添加一个属性</el-button>
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
				type: 0
			},
			dialogTableData: [
				{
					id: 0,
					name: '特性',
					value: '棕色,黄色',
					order: 50,
					status: 0,
					type: 'input',
					isShow: false,
					isEdit: true
				},
				{
					id: 1,
					name: '前置摄像机',
					value: '棕色',
					order: 50,
					status: 0,
					type: 'input',
					isShow: false,
					isEdit: true
				}
			],
			tableData: [
				{
					id: 0,
					name: '颜色',
					order: 50,
					status: 0,
					type: 0,
					sku_list: [{ id: 1, name: '颜色' }, { id: 2, name: '尺寸' }],
					dialogTableData: [
						{
							order: 50,
							name: '特性',
							type: 'input',
							value: ''
						},
						{
							order: 50,
							name: '前置摄像机',
							type: 'input',
							value: ''
						}
					]
				}
			],
			multipleSelection: [],
			currentPage: 0,
			createModel: false,
			rules: {
				name: [{ required: true, message: '规格名称不能为空', trigger: 'blur' }],
			},
			currentIndex: -1
		};
	},
	created() {},
	filters: {
		formatVal(val) {
			console.log(val)
			let arr = val.map(i => i.name);
			return arr.join(',');
		},
		toN(val) {
			return val && val.replace(/\n/g, '，')||val
		}
	},
	methods: {
		done(scope) {
			scope.row.isEdit = !scope.row.isEdit;
		},
		submit() {},
		//添加一个属性
		addAttr() {
			this.dialogTableData.push({
				id: 1,
				name: '颜色',
				value: '棕色',
				order: 50,
				status: 0,
				type: 'input',
				isShow: false,
				isEdit: true
			});
		},
		dialogDeleteItem(scope) {
			this.dialogTableData.splice(scope.$inedx, 1);
		},
		switchChange(e) {
			console.log(e);
		},
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
					value: '',
					dialogTableData:[]
				};
				this.dialogTableData=[]
			} else {
				//修改页面的 初始值
				this.form = {
					...e.row
				};
				this.dialogTableData=[...e.row.dialogTableData]
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
		ruleFn() {
			this.$refs.form.validate(res => {
				if (!res) return;
				let result = true;
				let messages = [];
				let str = ''
				this.dialogTableData.forEach((i,n) => {
					let no = n + 1;
					//属性名称验证
					if (i.name == '') {
						result = result && false; //只要一个为false 结果都是 false
						messages.push(`第${no}行属性名称不能为空`);
					}
					//排序验证
					if (i.order == '') {
						result = result && false;
						messages.push(`第${no}排序不能为空`);
					}
					//属性值验证
					if (i.type !== 'input' && i.value == '') {
						result = result && false;
						messages.push(`第${no}行属性值不能为空`);
					}
				});
				messages.forEach(v=>{
					str += `<div>${v}</div>`
				})
				//验证失败调用 notify 通知
				if (!result) {
				 	return this.$notify({
						title: '属性验证失败',
						type:'warning',
						dangerouslyUseHTMLString: true,
						duration:5000,
						message: str
					});
				}
				let msg = '添加';
				if (this.currentIndex == -1) {
					//添加表格
					// this.form.value = this.form.value.replace('\n', '，');
					this.tableData.unshift({
						...this.form,
						dialogTableData:[...this.dialogTableData]
					});
				} else {
					//修改表格
					//！！！ 一定要让这个 item 引用 this.batleData 的内存地址，否侧不生效
					let item = this.tableData[this.currentIndex];
					item.name = this.form.name;
					item.order = this.form.order;
					item.status = this.form.status;
					item.type = this.form.type;
					item.dialogTableData = this.dialogTableData
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
	},
	computed: {
		showArea() {
			return (scope, tag) => {
				if (tag) return scope.row.isEdit ? '编辑属性值' : '完成';
				return scope.row.type !== 'input' ? true : false;
			};
		}
	}
};
</script>

<style scoped="scoped">
.form-item-span {
	cursor: pointer;
	margin-right: 10px;
}
.form-item-span:hover > font {
	display: none;
}
.form-item-span > i {
	display: none;
}
.form-item-span:hover > i {
	display: inline-block;
}
::v-deep .el-textarea__inner {
	height: 75px !important;
}
</style>
