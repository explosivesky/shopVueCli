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
		<search-box placeholder="手机号/邮箱/会员名称" @search="search" class="pt-2">
			<!-- 左边 -->
			<template #left>
				<div style="width: 740px;"><el-button type="primary" class="mr-2" size="mini" @click="openDialog(false)">添加会员</el-button></div>
			</template>
			<!-- 右边 -->
			<template #right></template>
			<template #form>
				<!-- form表单 -->
				<el-form :inline="true" :model="searchForm" class="demo-form-inline flex justify-start" size="mini">
					<el-form-item label="搜索内容"><el-input v-model="searchForm.shopName" placeholder="手机号/邮箱/会员名称"></el-input></el-form-item>
					<el-form-item label="会员等级"><el-input v-model="searchForm.shopCode" type="number"></el-input></el-form-item>
					<el-form-item label="发布时间">
						<el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
				</el-form>
				<!-- 按钮组 -->
				<el-button-group>
					<el-button type="info" class="mr-2" size="mini" @click="search">搜索</el-button>
					<el-button size="mini" @click="clearForm">清空筛选条件</el-button>
				</el-button-group>
			</template>
		</search-box>
		<!-- tabel 表格 -->
		<el-table :data="tableData" class="mt-2" border style="width: 100%">
			<el-table-column label="会员" width="450">
				<template slot-scope="scope">
					<div class="flex align-center" style="height: 100%;">
						<div class="media w-100">
							<img :src="scope.row.avatar" class="mr-3 img-cover border" style="width: 60px; height: 60px; border-radius: 100%;" />
							<div class="media-body">
								<div class="flex justify-between flex ">
									<h6 class="mt-0">用户名：{{ scope.row.username }}</h6>
									<el-button type="text" size="mini">详情</el-button>
								</div>
								<small>用户ID ：{{ scope.row.id }}</small>
							</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="level.name" align="center" label="会员等级" width="180"></el-table-column>
			<el-table-column align="center" label="注册/登录">
				<template slot-scope="scope">
					<div class="">注册时间 : {{ scope.row.create_time }}</div>
					<div class="">最后登录 : {{ scope.row.update_time }}</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态" width="80">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status"></el-switch>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="text" class="text-primary mr-2" @click="openDialog(scope)">修改</el-button>
						<el-button type="text" class="text-primary mr-2">重置密码</el-button>
						<el-button type="text" class="text-primary">删除</el-button>
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
		<el-dialog title="添加会员" :visible.sync="createModel" :modal="false">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户名"><el-input v-model="form.username" type="text" placeholder="用户名" class="w-50"></el-input></el-form-item>
				<el-form-item label="密码"><el-input v-model="form.password" type="password" placeholder="密码" class="w-50"></el-input></el-form-item>
				<el-form-item label="昵称"><el-input v-model="form.nikename" type="text" placeholder="名称" class="w-50"></el-input></el-form-item>
				<el-form-item label="头像">
					<template slot-scope="scope">
						<div class="flex align-center justify-center border rounded p-0 cursor-pointer" style="height: 50px; width: 50px;" @click="openImgDialog">
							<div class="position-relative" style="height: 100%; width: 100%;" v-if="form.avatar">
								<img :src="form.avatar" class="w-100" style="height: 100%;" />
								<div
									class="btn position-absolute el-icon-close flex justify-center align-center text-white p-0"
									style="font-size: 15px; right: 0; top: 0;background-color: rgba(0,0,0,.5); z-index: 12;"
									@click.stop="deleteImg"
								></div>
							</div>
							<span v-else class="el-icon-plus" style="font-size: 20px;"></span>
						</div>
					</template>
				</el-form-item>
				<el-form-item label="会员等级">
					<el-select v-model="form.level_id" placeholder="会员等级">
						<el-option label="普通会员" :value="1"></el-option>
						<el-option label="黄金会员" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机"><el-input v-model="form.phone" type="phone" placeholder="手机" class="w-50"></el-input></el-form-item>
				<el-form-item label="邮箱"><el-input v-model="form.email" type="email" placeholder="邮箱" class="w-50"></el-input></el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="form.sex">
						<el-radio :label="0" border>保密</el-radio>
						<el-radio :label="1" border>男性</el-radio>
						<el-radio :label="2" border>女性</el-radio>
					</el-radio-group>
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
			tableData: [
				{
					id: 10,
					avatar: 'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
					username: '二傻子',
					level_id: 1,
					level: {
						id: 1,
						name: '普通会员'
					},
					create_time: '2121-23-22 15:22:22',
					update_time: '2121-23-22 15:22:22',
					status: true
				}
			],
			form: {
				username: '',
				password: '',
				nickname: '',
				avatar: '',
				level_id: 1,
				phone: '',
				email: '',
				sex: 0,
				status: true
			},
			editIndex: -1,
			date: '',
			multipleSelection: [],
			currentPage: 0,
			createModel: false
		};
	},
	created() {},
	inject: ['app'],
	methods: {
		//图像选择dialog
		openImgDialog() {
			this.app.openImgDialog(res => {
				console.log(res);
				this.form.avatar = res.src;
			});
		},
		//确定
		ensure() {
			let msg = '';
			//创建
			if (this.editIndex == -1) {
				this.tableData.unshift({
					id: 10,
					avatar: this.form.avatar,
					username: this.form.username,
					level_id: this.form.level_id,
					level: {
						id: 1,
						name:this.form.level_id == 1 ? '普通会员' : '黄金会员'
					},
					create_time: '2121-23-22 15:22:22',
					update_time: '2121-23-22 15:22:22',
					status: this.form.status
				});
				msg = '添加';
			} else {
				//修改
				let item = this.tableData[this.editIndex];
				item.avatar = this.form.avatar;
				item.username = this.form.username;
				item.level_id = this.form.level_id;
				item.level.name= this.form.level_id == 1 ? '普通会员' : '黄金会员'
				item.status = this.form.status;
				this.editIndex = -1;
				msg = '修改';
			}
			this.$message.success(msg + '成功');
			this.createModel = false;
		},
		//打开 dialog
		openDialog(e) {
			//创建
			if (e == false) {
				this.form = {
					username: '',
					password: '',
					nickname: '',
					avatar: '',
					level_id: 1,
					phone: '',
					email: '',
					sex: 0,
					status: true
				};
			} else {
				//修改
				this.form = {
					username: e.row.username,
					password: '',
					nickname: '',
					avatar: e.row.avatar,
					level_id: e.row.level_id,
					phone: '',
					email: '',
					sex: 0,
					status: e.row.status
				};
				this.editIndex = e.$index;
			}
			this.createModel = true;
		},
		handleClick() {
			console.log(this.activeName);
		},
		superSearch(boolean) {
			this.isShow = boolean;
		},
		//清空筛选条件
		clearForm() {
			this.isShow = false;
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
			this.multipleSelection = val;
			console.log(val);
		},
		//删除表单图片
		deleteImg() {
			this.form.avatar = '';
		},
		//当前项改变时触发
		handleCurrentChange() {},
		//size 发生变化时触发
		handleSizeChange() {}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
