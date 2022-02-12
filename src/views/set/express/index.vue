<template>
	<div class="bg-white px-4 position-absolute" style="top: 55px; right: 0; bottom: 0; left: 0;">
		<el-tabs v-model="tabActive">
			<!-- 运费模板 -->
			<el-tab-pane label="运费模板">
				<div class=""><el-button type="primary" class="mr-2" size="mini" @click="openRulesDialog(false)">添加模板</el-button></div>
				<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" height="700" border style="width: 100%" class="mt-2 pb-1">
					<el-table-column label="模板名称" prop="name" width="385" show-overflow-tooltip></el-table-column>
					<el-table-column label="计费方式" align="center">
						<template slot-scope="scope">
							{{ scope.row.type | typeFilter }}
						</template>
					</el-table-column>
					<el-table-column prop="order" align="center" label="排序" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" label="操作" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button type="text" class="mr-2" size="mini" @click="openRulesDialog(scope)">修改</el-button>
							<el-button type="text" class="mr-2" size="mini" @click="openDrawer(scope.row)">配置模板({{ scope.row.express_values.length }})</el-button>
							<el-button type="text" size="mini" @click="deleteSku('single', scope.row.id)">删除</el-button>
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
		<!-- 页尾 -->
		<el-footer class="p-0" style="position: absolute; left: 0; right: 0; bottom: 0; background-color: #f8f9fa;">
			<div class="pl-2  flex align-center h-100">
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
		</el-footer>

		<el-dialog title="添加模板" :visible.sync="createModel" top="5vh" :modal="false">
			<!-- 表单内容 -->
			<el-form ref="form" :model="model" label-width="80px">
				<el-form-item label="模板名称" prop="name"><el-input v-model="model.name" placeholder="模板名称" size="mini" style="width: 25%;"></el-input></el-form-item>
				<el-form-item label="排序" prop="level"><el-input type="number" v-model="model.order" placeholder="排序" size="mini" style="width: 25%;"></el-input></el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="model.type" size="mini">
						<el-radio :label="1" border>按重量</el-radio>
						<el-radio :label="0" border>按件数</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>

		<el-drawer size="70%" :visible.sync="drawer" :modal="false" :with-header="false">
			<div class="p-3">
				<el-table border class="mt-3" :data="express_values" style="width: 100%">
					<el-table-column align="center" label="ID" prop="id"></el-table-column>
					<el-table-column align="center" label="可配送区域" width="200">
						<template slot-scope="scope">
							<el-cascader size="mini" :options="options" :props="props" :clearable="false" collapse-tags clearable v-model="scope.row.region" @change="change(scope.row)"></el-cascader>
						</template>
					</el-table-column>
					<el-table-column align="center" width="150" label="首件(个)/首重(Kg)">
						<template slot-scope="scope">
							<el-input type="number" size="mini" v-model="scope.row.first" @change="change(scope.row)"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" width="150" label="运费(元)">
						<template slot-scope="scope">
							<el-input type="number" size="mini" v-model="scope.row.first_price" @change="change(scope.row)"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" width="150" label="续件/续重">
						<template slot-scope="scope">
							<el-input type="number" size="mini" v-model="scope.row.add" @change="change(scope.row)"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" width="150" label="续费(元)">
						<template slot-scope="scope">
							<el-input type="number" size="mini" v-model="scope.row.add_price" @change="change(scope.row)"></el-input>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="deleteValue(scope.row, scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button type="primary" class="mt-3" @click="addValue">添加策略</el-button>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import mixin from '@/common/mixins';
export default {
	inject: ['layout', 'app'],
	mixins: [mixin],
	data() {
		return {
			tabActive: 0,
			tableData: [],
			form: {
				customer: '',
				key: ''
			},
			model: {
				name: '',
				order: 50,
				type: 0
			},
			modelIndex: -1,
			dynamicUrl: 'express',
			createModel: false,
			drawer: false,
			express_values: [],
			drawerId:0,
			props:{
				multiple: true,
				value:'name',
				label:'name'
			},
			options:[]
		};
	},
	filters: {
		typeFilter(val) {
			let arr = ['按件数', '按重量'];
			return arr[val];
		}
	},
	methods: {
		//mixin
		getMixinList(data) {
			this.tableData = data.list;
			this.options = data.area.map(v=>{
				v.children = v.citys.map(j=>{
					j.children = j.districts
					return j
				})
				return v
			})
		},
		//打开规格dialog
		openRulesDialog(e) {
			//新建
			if (e == false) {
				this.model = {
					name: '',
					order: 50,
					type: 0
				};
				this.modelIndex = -1;
			} else {
				//修改页面的 初始值
				this.model = {
					...e.row
				};
				this.modelIndex = e.$index;
			}
			this.createModel = true;
		},
		//dialog确定
		submit() {
			let id = 0;
			//修改
			if (this.modelIndex !== -1) {
				id = this.modelIndex;
			}
			this.addOrEdit(this.form, id);
			this.createModel = false;
		},
		//打开抽屉
		openDrawer(row) {
			this.express_values = row.express_values;
			this.drawer = true;
			this.drawerId=row.id
		},
		//添加策略
		addValue() {
			new this.request(this.url.m().express_value.add_or_edit,{
				first:0,
				first_price:0,
				add:0,
				add_price:0,
				express_id:this.drawerId,
				region:[
					['全国','所有','所有']
				],
			}).modepost().then(res => {
				this.express_values.push(res.data.data)
			})
			this.$message.success('添加成功');
		},
		//修改
		change(row){
			if(row.region.length===0)return this.$message.warning('可配送区域不能为空')
			new this.request(this.url.m(row.id).express_value.add_or_edit,row).modepost()
		}
	}
};
</script>

<style></style>
