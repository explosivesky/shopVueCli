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
				<div class="flex">
					<!-- form表单 -->
					<el-form :inline="true" :model="searchForm" class="demo-form-inline flex justify-start" size="mini">
						<el-form-item label="搜索内容"><el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员名称"></el-input></el-form-item>
						<el-form-item label="会员等级">
							<el-select v-model="searchForm.user_level_id" placeholder="请选择活动区域">
								<el-option :label="item.name" :value="item.id" v-for="(item,index) in user_level" :key="index"></el-option>
							</el-select>
						</el-input></el-form-item>
					</el-form>
					<!-- 按钮组 -->
					<el-button-group class="ml-auto">
						<el-button type="info" class="mr-2" size="mini" @click="search">搜索</el-button>
						<el-button size="mini" @click="clearForm">清空筛选条件</el-button>
					</el-button-group>
				</div>
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
			<el-table-column align="center" label="会员等级" width="180">
				<template slot-scope="scope">
					{{scope.row.user_level.name}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="注册/登录">
				<template slot-scope="scope">
					<div class="">注册时间 : {{ scope.row.create_time }}</div>
					<div class="">最后登录 : {{ scope.row.update_time }}</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态" width="80">
				<template slot-scope="scope">
					<el-button :type="scope.row.status ? 'warning' : 'success'" size="mini" @click="isBan(scope.row)">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作">
				<template slot-scope="scope">
					<el-button-group>
						<el-button type="text" class="text-primary mr-2" @click="openDialog(scope)">修改</el-button>
						<el-button type="text" class="text-primary mr-2">重置密码</el-button>
						<el-button type="text" class="text-primary" @click="deleteItem(scope)">删除</el-button>
					</el-button-group>
				</template>
			</el-table-column>
		</el-table>
		<div class="position-fixed bg-white flex" style="bottom: 0; left: 200px; right: 0; height: 60px; z-index: 9;">
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
		<el-dialog title="添加会员" :visible.sync="createModel" :modal="false">
			<el-form ref="form" :model="form" label-width="80px">
				<el-form-item label="用户名"><el-input v-model="form.username" type="text" placeholder="用户名" class="w-50"></el-input></el-form-item>
				<el-form-item label="密码"><el-input v-model="form.password" type="password" placeholder="密码" class="w-50"></el-input></el-form-item>
				<el-form-item label="昵称"><el-input v-model="form.nickname" type="text" placeholder="名称" class="w-50"></el-input></el-form-item>
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
					<el-select v-model="form.user_level_id" placeholder="请选择活动区域">
						<el-option :label="item.name" :value="item.id" v-for="(item,index) in user_level" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机"><el-input v-model="form.phone" type="phone" placeholder="手机" class="w-50"></el-input></el-form-item>
				<el-form-item label="邮箱"><el-input v-model="form.email" type="email" placeholder="邮箱" class="w-50"></el-input></el-form-item>
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
	inject:['app','layout'],
	mixins:[mixin],
	data() {
		return {
			tableIndex: 0,
			isShow: false,
			searchForm: {
				keyword: '',
				user_level_id: '',
			},
			tableData: [
			],
			form: {
			},
			editIndex: -1,
			multipleSelection: [],
			currentPage: 0,
			createModel: false,
			dynamicUrl:'user',
			user_level:[]
		};
	},
	methods: {
		//覆盖 mixins 的getMixinList
		getMixinList(data) {
			this.tableData=data.list
			this.user_level=data.user_level
		},
		//覆盖 mixins 的init url
		editUrlVal() {
			//组件中没写这个方法 则不会覆盖
			return this.url.m(this.page.currentPage, '?limit=' + this.page.pageSize+'&keyword='+this.searchForm.keyword+'&user_level_id='+this.searchForm.user_level_id)[this.dynamicUrl].init
		},
		//图像选择dialog
		openImgDialog() {
			this.app.openImgDialog(res => {
				this.form.avatar = res.src;
			});
		},
		//确定
		ensure() {
			//修改
			let id = 0
			if (this.editIndex !== -1) {
				id=this.tableData[this.editIndex].id
			}
			this.addOrEdit(this.form,id)//mixins
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
					user_level_id: '',
					phone: '',
					email: '',
					status: true
				};
			} else {
				//修改
				this.form = {
					id:e.row.id,
					username: e.row.username,
					password: '',
					nickname: e.row.nickname,
					avatar: e.row.avatar,
					user_level_id: e.row.user_level_id,
					phone: parseInt(e.row.phone),
					email: e.row.email,
					status: e.row.status
				};
				this.editIndex = e.$index;
			}
			this.createModel = true;
		},
		//清空筛选条件
		clearForm() {
			this.isShow = false;
			this.searchForm = {
				keyword:'',
				user_level_id: ''
			};
		},
		//搜索 || 高级搜索
		search(e) {
			//普通搜索
			if (typeof e === 'string') {
				this.searchForm.keyword=e
				this.__init()
				return
			}
			//高级搜索
			this.__init()
		},
		//删除表单图片
		deleteImg() {
			this.form.avatar = '';
		},
		//删除会员列表项
		deleteItem(scope){
			this.deleteSku('single',scope.row.id)
		}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
