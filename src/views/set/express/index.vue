<template>
	<div class="bg-white px-4 position-absolute" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<el-tabs v-model="tabActive" @tab-click="tabChange">
			<!-- 运费模板 -->
			<el-tab-pane label="运费模板">
				<div class="">
					<el-button type="primary" class="mr-2" size="mini" @click="openRulesDialog(false)">添加模板</el-button>
				</div>
				<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="700" border style="width: 100%" class="mt-2 pb-1">
					<el-table-column label="模板名称" prop="name" width="385" show-overflow-tooltip></el-table-column>
					<el-table-column label="计费方式" align="center">
						<template slot-scope="scope">
							{{ scope.row.type | typeFilter }}
						</template>
					</el-table-column>
					<el-table-column prop="order" align="center" label="排序" show-overflow-tooltip></el-table-column>
					<el-table-column label="添加时间" width="140" align="center" prop="create_time" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" width="140" label="状态" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status"></el-switch>
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
			</el-tab-pane>
			<!-- 上传设置 -->
			<el-tab-pane label="默认上传方式">
				<el-form ref="form" :model="form" label-width="160px">
					<el-form-item label="快递100 Customer">
						<el-input v-model="form.customer" size="mini" style="width: 50%;" placeholder="快递100 Customer"></el-input>
						<small class="text-secondary d-block">
							用于查询物流信息，
							<a href="#">快递100申请</a>
						</small>
					</el-form-item>
					<el-form-item label="快递100 Key"><el-input v-model="form.key" size="mini" style="width: 50%;" placeholder="快递100 Key"></el-input></el-form-item>
					<el-form-item><el-button type="primary" size="mini">保存</el-button></el-form-item>
				</el-form>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			tabActive: 0,
			tableData: [
				{
					name: '全国统一邮费',
					type: 1,
					create_time: '2019-07-17 16:29:32',
					status: 1,
					order: 100
				}
			],
			form: {
				customer: '',
				key: ''
			}
		};
	},
	filters: {
		typeFilter(val) {
			let arr = ['按重量', '按件数'];
			return arr[val];
		}
	},
	methods: {
		//tab 钩子
		tabChange(tab, event) {
			console.log(tab, event);
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
					dialogTableData: []
				};
				this.dialogTableData = [];
			} else {
				//修改页面的 初始值
				this.form = {
					...e.row
				};
				this.dialogTableData = [...e.row.dialogTableData];
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
				let str = '';
				this.dialogTableData.forEach((i, n) => {
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
				messages.forEach(v => {
					str += `<div>${v}</div>`;
				});
				//验证失败调用 notify 通知
				if (!result) {
					return this.$notify({
						title: '属性验证失败',
						type: 'warning',
						dangerouslyUseHTMLString: true,
						duration: 5000,
						message: str
					});
				}
				let msg = '添加';
				if (this.currentIndex == -1) {
					//添加表格
					// this.form.value = this.form.value.replace('\n', '，');
					this.tableData.unshift({
						...this.form,
						dialogTableData: [...this.dialogTableData]
					});
				} else {
					//修改表格
					//！！！ 一定要让这个 item 引用 this.batleData 的内存地址，否侧不生效
					let item = this.tableData[this.currentIndex];
					item.name = this.form.name;
					item.order = this.form.order;
					item.status = this.form.status;
					item.type = this.form.type;
					item.dialogTableData = this.dialogTableData;
					msg = '修改';
					this.currentIndex = -1;
				}
				this.closeRulesDialog();
				this.$message.success(msg + '成功');
			});
		}
	}
};
</script>

<style></style>
