<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="管理员列表" name="second">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini">添加管理员</el-button>
					<div class="ml-auto d-flex">
						<el-input size="mini" placeholder="请输入用户名" v-model="keyword" style="width:200px;"></el-input>
						<el-button type="info" size="mini" class="ml-2">搜索</el-button>
					</div>
				</div>
				<el-table border class="mt-3" :data="managerList" style="width: 100%">
					<el-table-column align="center" label="用户头像">
						<template slot-scope="scope">
							<el-avatar size="large" :src="scope.row.avatar"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column align="center" label="用户名" prop="username"></el-table-column>
					<el-table-column align="center" width="250" label="手机号" prop="phone"></el-table-column>
					<el-table-column prop="email" align="center" label="邮箱"></el-table-column>
					<el-table-column align="center" label="所属管理员">
						<template slot-scope="scope">
							{{ scope.row.group.name }}
						</template>
					</el-table-column>
					<el-table-column prop="status" align="center" label="状态">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="150">
						<template slot-scope="scope">
							<el-button type="text" size="mini">修改</el-button>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="角色列表" name="third">
				<div class="d-flex align-items-center"><el-button type="primary" size="mini" v-auth="'添加角色'">添加角色</el-button></div>
				<el-table border class="mt-3" :data="groupList" style="width: 100%">
					<el-table-column align="center" label="角色名称" prop="name"></el-table-column>
					<el-table-column prop="status" align="center" label="状态">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="250">
						<template slot-scope="scope">
							<el-button type="text" size="mini">修改</el-button>
							<el-button type="text" size="mini">配置权限</el-button>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权限列表" name="auth">
				<div class="custom-tree-container">
					<div class="block">
						<el-tree
							:data="data"
							show-checkbox
							:draggable="true"
							default-expand-all
							node-key="id"
							@node-drop="nodeDrop"
							default-expand-all
							:expand-on-click-node="false"
						>
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<span v-if="!data.edit">{{ node.label }}</span>
								<span v-else><el-input type="text" size="mini" v-model="data.label"></el-input></span>
								<span>
									<el-button :type="!data.status ? 'primary' : 'warning'" size="mini" @click.stop="isShow(data)">{{ isShowCom(data) }}</el-button>
									<el-button type="success" size="mini" @click.stop="isAdd(data)">增加</el-button>
									<el-button :type="data.edit == 1 ? '' : 'warning'" size="mini" @click.stop="isEdit(data)">{{ isEditCom(data) }}</el-button>
									<el-button type="danger" size="mini" @click.stop="isDelete(node, data)">删除</el-button>
								</span>
							</span>
						</el-tree>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			activeName: 'second',
			managerList: [
				{
					id: 10,
					username: '用户名',
					avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4100987808,2324741924&fm=27&gp=0.jpg',
					phone: '15648897641',
					email: '15648897641@163.com',
					group_id: 1,
					group: {
						id: 1,
						name: '管理员'
					},
					status: 1
				}
			],
			groupList: [
				{
					id: 10,
					name: '超级管理员',
					status: 1
				}
			],
			data: [
				{
					id: 1,
					label: '一级 1',
					status: 1,
					editStatus: false,
					children: [
						{
							id: 2,
							label: '二级 1-1',
							status: 1,
							editStatus: false,
							children: [
								{
									id: 3,
									label: '三级 1-1-1',
									status: 1,
									editStatus: false
								}
							]
						}
					]
				}
			],
			defaultProps: {
				children: 'children',
				label: 'label'
			}
		};
	},
	methods: {
		isShow(data) {
			console.log(data);
			data.status = data.status ? 0 : 1;
		},
		isEdit(data) {
			data.edit = data.edit ? 0 : 1;
		},
		isDelete(node, data) {
			console.log(node);
			let parent = node.parent;
			let childNodes = parent.childNodes;
			let index = childNodes.findIndex(v => v.data.id == data.id);
			if (index == -1) return;
			childNodes.splice(index, 1);
		},
		isAdd(data) {
			console.log(data);
			if (!data.children) data.children = [];
			data.children.push({
				id: 22,
				label: '二级 3-2',
				status: 1,
				edit: 1,
				children: []
			});
		},
		nodeDrop(...event) {
			console.log(event);
		},
		//创建顶级分类
		createLevel() {
			this.$prompt('请输入顶级分类名称', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValidator(val) {
					if (val == '' || val == null) {
						return '顶级分类名称不能为空';
					}
				}
			}).then(({ value }) => {
				//提交服务器
				console.log(value);
			});
		}
	},
	computed:{
		isShowCom(){
			return (data)=>{
				return data.status ? '隐藏' : '显示'
			}
		},
		isEditCom(){
			return(data)=>{
				return data.edit ? '完成' : '修改'
			}
		}
	}
};
</script>

<style scoped="scoped">
	.custom-tree-node {
	  flex: 1;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  font-size: 14px;
	  padding-right: 8px;
	}
	::v-deep .el-tree-node__content{
			  padding: 25px 0;
	}
</style>
