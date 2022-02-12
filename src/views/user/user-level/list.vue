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
		<search-box class="pt-2">
			<!-- 左边 -->
			<template #left>
				<div style="width: 740px;"><el-button type="success" class="mr-2" size="mini" @click="openDialog(false)">添加等级</el-button></div>
			</template>
			<!-- 右边 -->
			<template #right>
				<div class="flex align-center">
					<span style="font-size: 0.75rem;">选择升级标准 : </span>
					<el-radio-group v-model="level" size="mini" class="ml-2">
						<el-radio-button :label="0" border>累计消费</el-radio-button>
						<el-radio-button :label="1" border>累计次数</el-radio-button>
					</el-radio-group>
				</div>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table :data="tableData" class="mt-2" border style="width: 100%">
			<el-table-column label="会员等级" width="220" prop="name" align="center"></el-table-column>
			<el-table-column align="center" label="升级条件" width="220">
				<template slot-scope="scope">
					{{ getUpCondition.name + ' : ' + scope.row[getUpCondition.value] }}
				</template>
			</el-table-column>
			<el-table-column align="center" label="折扣率(%)" prop="discount"></el-table-column>
			<el-table-column align="center" label="等级序号" width="120" prop="level"></el-table-column>
			<el-table-column align="center" label="状态" prop="discount">
				<template slot-scope="scope">
						<el-button :type="scope.row.status ? 'warning' : 'success'" size="mini" @click="isBan(scope.row)">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="text" class="text-primary mr-2" @click="openDialog(scope)">修改</el-button>
						<el-button type="text" class="text-primary" @click="deleteItem(scope)">删除</el-button>
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
		<!-- dialog -->
		<el-dialog title="添加等级" :visible.sync="createModel" :modal="false" width="60%" top="15vh">
			<!-- 表单内容 -->
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="等级名称" prop="name">
					<el-input v-model="form.name" placeholder="等级名称" size="mini" style="width: 25%;"></el-input>
					<small class="text-secondary d-block">
						设置会员等级名称
					</small>
				</el-form-item>
				<el-form-item label="等级权重" prop="level">
					<el-input type="number" v-model="form.level" placeholder="等级权重" size="mini" style="width: 25%;"></el-input>
					<small class="text-secondary d-block">
						设置会员等级排序(此参数决定等级的高低,排序越大等级越高,请谨慎选择)
					</small>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-radio-group v-model="form.status" size="mini">
						<el-radio :label="1" border>启用</el-radio>
						<el-radio :label="0" border>禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="升级条件">
					<div>
						<small class="mr-2">累计消费满</small>
						<el-input type="number" v-model="form.max_price" placeholder="累计消费" size="mini" style="width: 25%;">
							<template slot="append">元</template>
						</el-input>
						<small class="text-secondary d-block">
							设置会员等级所需要的累计消费必须大于等于0,单位：元
						</small>
					</div>
					<div>
						<small class="mr-2">累计次数满</small>
						<el-input type="number" v-model="form.max_times" placeholder="累计次数" size="mini" style="width: 25%;">
							<template slot="append">次</template>
						</el-input>
						<small class="text-secondary d-block">
							设置会员等级所需要的购买量必须大于等于0,单位：笔
						</small>
					</div>
				</el-form-item>
				<el-form-item label="折扣率(%)">
					<el-input size='mini' type="number" v-model="form.discount" placeholder="折扣率" style="width: 25%;">
						<template slot="append">%</template>
					</el-input>
					<small class="text-secondary d-block">
						折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
					</small>
				</el-form-item>
			</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="createModel = false">取 消</el-button>
						<el-button type="primary" @click="ensure">确 定</el-button>
					</div>
			</el-dialog>
	</div>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox.vue';
import mixin from '@/common/mixins'
export default {
	inject: ['app','layout'],
	mixins:[mixin],
	data() {
		return {
			level: 0,
			tableData: [
			],
			form: {
				name: '',
				max_price: 0,
				max_times: 0,
				discount: 0,
				level: 0,
				status: 1 //启用
			},
			editIndex: -1,
			createModel: false,
			dynamicUrl:'user_level'
		};
	},
	created() {},
	methods: {
		getMixinList(data) {
			this.tableData =data.list
		},
		//确定
		ensure() {
			//修改
			let id = 0 
			if (this.editIndex !== -1) {
				id = this.tableData[this.editIndex].id
			}
			this.addOrEdit(this.form,id)
			this.createModel = false;
		},
		//打开 dialog
		openDialog(e) {
			//创建
			if (e == false) {
				this.form = {
					name: '',
					max_price: 0,
					max_times: 0,
					discount: 0,
					level: 0,
					status: true,
					create_time: '',
				};
				this.editIndex = -1;
			} else {
				//修改
				this.form = {
					name: e.row.name,
					max_price: e.row.max_price,
					max_times: e.row.max_times,
					discount: e.row.discount,
					level: e.row.level,
					status: e.row.status,
					create_time: e.row.create_time
				};
				this.editIndex = e.$index;
			}
			this.createModel = true;
		},
		deleteItem(scope){
			this.deleteSku('single', scope.row.id)
		}
	},
	computed: {
		//升级条件
		getUpCondition() {
			let arr = [
				{
					name: '累计消费',
					value: 'max_price'
				},
				{
					name: '消费次数',
					value: 'max_times'
				}
			];
			return arr[this.level];
		}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
