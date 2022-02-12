<template>
	<div class="bg-white px-3" style="margin: -20px;margin-top: -1rem;margin-bottom: 0!important;">
		<el-tabs v-model="dynamicUrl" @tab-click="__init">
			<el-tab-pane label="管理员列表" name="manager">
				<div class="d-flex align-items-center">
					<el-button type="primary" size="mini" @click="openDialog('manager')">添加管理员</el-button>
					<div class="ml-auto d-flex">
						<el-input size="mini" placeholder="请输入用户名" v-model="keyword" style="width:200px;"></el-input>
						<el-button type="info" size="mini" class="ml-2" @click="search">搜索</el-button>
					</div>
				</div>
				<el-table border class="mt-3" :data="managerList" style="width: 100%">
					<el-table-column align="center" label="用户头像">
						<template slot-scope="scope">
							<el-avatar size="large" :src="scope.row.avatar"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column align="center" label="用户名" prop="username"></el-table-column>
					<el-table-column align="center" label="所属管理员">
						<template slot-scope="scope">
							{{ scope.row.role.name }}
						</template>
					</el-table-column>
					<el-table-column prop="status" align="center" label="状态">
						<template slot-scope="scope">
							<el-button :type="scope.row.status ? 'warning' : 'success'" size="mini" @click="isBan(scope.row)">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="150">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="openDialog('manager', scope)">修改</el-button>
							<el-button type="text" size="mini" @click="managerDelete(scope.row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="角色列表" name="role">
				<div class="d-flex align-items-center"><el-button type="primary" size="mini" v-auth="'添加角色'" @click="openDialog('role')">添加角色</el-button></div>
				<el-table border class="mt-3" :data="roleList" style="width: 100%">
					<el-table-column align="center" label="角色名称" prop="name"></el-table-column>
					<el-table-column align="center" label="角色名称" prop="desc"></el-table-column>
					<el-table-column prop="status" align="center" label="状态">
						<template slot-scope="scope">
							<el-button :type="scope.row.status ? 'warning' : 'success'" size="mini" @click="isBan(scope.row)">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" width="250">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click="openDialog('role', scope)">修改</el-button>
							<el-button type="text" size="mini" @click="openDrawer(scope.row)">配置权限</el-button>
							<el-button type="text" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="权限列表" name="rule">
				<div class="d-flex align-items-center"><el-button type="primary" size="mini" v-auth="'添加规格'" @click="openDialog('rule')">添加规格</el-button></div>
				<div class="custom-tree-container">
					<div class="block">
						<el-tree :data="ruleList" default-expand-all node-key="id" :props="defaultProps" :expand-on-click-node="false">
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<span>
									<span v-if="data.menu" class="mr-2 text-muted" :class="data.icon ? data.icon : 'el-icon-star-off'"></span>
									<small v-else class="badge">{{ data.method }}</small>
									<span>{{ data.name }}</span>
									<span v-if="data.menu" class="badge">{{ data.frontpath }}</span>
									<span v-else class="ml-2 badge badge-secondary">{{ data.condition }}</span>
								</span>
								<span>
									<el-button type="text" plain size="mini" @click.stop="isShow(data)">{{ data.status ? '显示' : '隐藏'}}</el-button>
									<el-button type="text" size="mini" plain @click.stop="openDialog('rule',data.id)">增加</el-button>
									<el-button type="text" plain size="mini" @click.stop="openDialog('rule',data)">{{ isEditCom(data) }}</el-button>
									<el-button type="danger" size="mini" @click.stop="deleteSku('single',data.id)" plain>删除</el-button>
								</span>
							</span>
						</el-tree>
					</div>
				</div>
			</el-tab-pane>
		</el-tabs>
		<el-footer class="p-0 flex align-center" style="position: absolute; left: 0; right: 0; bottom: 0; background-color: #FFFFFF" v-if="dynamicUrl !== 'rule'">
			<div class=" flex-1 px-3 flex align-center justify-between">
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
		<!-- dialog -->
		<el-dialog :title="title" :visible.sync="createModel" :modal="false" :before-close="handleClose" width="70%">
			<!-- manager -->
			<el-form :model="form" label-width="80px" v-if="dynamicUrl == 'manager'">
				<el-form-item label="用户名"><el-input v-model="form.manager.username" type="text" placeholder="用户名" class="w-50" size="mini"></el-input></el-form-item>
				<el-form-item label="密码"><el-input v-model="form.manager.password" type="password" placeholder="密码" class="w-50" size="mini"></el-input></el-form-item>
				<el-form-item label="头像">
					<div class="flex align-center justify-center border rounded p-0 cursor-pointer" style="height: 50px; width: 50px;" @click="openImgDialog">
						<div class="position-relative" style="height: 100%; width: 100%;" v-if="form.manager.avatar">
							<img :src="form.manager.avatar" class="w-100" style="height: 100%;" />
							<div
								class="btn position-absolute el-icon-close flex justify-center align-center text-white p-0"
								style="font-size: 15px; right: 0; top: 0;background-color: rgba(0,0,0,.5); z-index: 12;"
								@click.stop="deleteImg"
							></div>
						</div>
						<span v-else class="el-icon-plus" style="font-size: 20px;"></span>
					</div>
				</el-form-item>
				<el-form-item label="角色">
					<el-select v-model="form.manager.role_id" placeholder="请选择角色" size="mini">
						<el-option :label="item.name" :value="item.id" v-for="(item, index) in roleOptions" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.manager.status" size="mini">
						<el-radio :label="0" border>启用</el-radio>
						<el-radio :label="1" border>禁止</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<!-- role -->
			<el-form :model="form" label-width="80px" v-if="dynamicUrl == 'role'">
				<el-form-item label="角色名称"><el-input v-model="form.role.name" type="text" placeholder="角色名称" class="w-50" size="mini"></el-input></el-form-item>
				<el-form-item label="角色描述">
					<el-input v-model="form.role.desc" type="textarea" placeholder="角色描述" class="w-50" size="mini" style="width: 400px;"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.role.status" size="mini">
						<el-radio :label="0" border>启用</el-radio>
						<el-radio :label="1" border>禁止</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<!-- rule -->
			<el-form :model="form" label-width="100px" v-if="dynamicUrl == 'rule'">
				<el-form-item label="上级规则">
					<el-select v-model="form.rule.rule_id" placeholder="请选择上级规则" size="mini">
						<el-option label="顶级路径" :value="0"></el-option>
						<el-option :label="item | tree" :value="item.id" v-for="(item, index) in ruleOptions" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="菜单/规则">
					<el-radio-group v-model="form.rule.menu" size="mini">
						<el-radio :label="1" border>菜单</el-radio>
						<el-radio :label="0" border>规则</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="名称"><el-input v-model="form.rule.name" type="text" placeholder="名称" class="w-50" size="mini"></el-input></el-form-item>

				<el-form-item label="图标" v-if="form.rule.menu">
					<el-input v-model="form.rule.icon" type="text" placeholder="图标" class="w-50" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="前端路由路径" v-if="form.rule.menu && form.rule.rule_id > 0">
					<el-input v-model="form.rule.frontpath" type="text" placeholder="前端路由路径" class="w-50" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="前端路由别名" v-if="form.rule.menu">
					<el-input v-model="form.rule.desc" type="text" placeholder="前端路由别名" class="w-50" size="mini"></el-input>
				</el-form-item>

				<el-form-item label="后端规则" v-if="!form.rule.menu">
					<el-input v-model="form.rule.condition" type="password" placeholder="控制器方法" class="w-50" size="mini"></el-input>
				</el-form-item>
				<el-form-item label="请求方式" v-if="!form.rule.menu">
					<el-select v-model="form.rule.method" placeholder="请选择请求方式" size="mini">
						<el-option label="GET" value="GET"></el-option>
						<el-option label="POST" value="POST"></el-option>
						<el-option label="PUT" value="PUT"></el-option>
						<el-option label="DELETE" value="DELETE"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="form.rule.status" size="mini">
						<el-radio :label="0" border>启用</el-radio>
						<el-radio :label="1" border>禁止</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="createModel = false" size="mini">取 消</el-button>
				<el-button type="primary" @click="ensure" size="mini">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 抽屉 -->
		<el-drawer
		  title="配置权限"
		  :visible.sync="drawer"
		  :direction="direction"
		  :modal="false"
		  wrapperClosable
		  size='40%'
		  :before-close="handleClose">
		  <div class="position-absolute " style="bottom: 0; left: 0; top: 0; right: 0;">
			  <div class="position-absolute border-top border-bottom" style="top: 60px; left: 0; right: 0; bottom: 60px; overflow-y: auto;">
			  	<el-tree
			  	  :data="ruleList"
			  	  show-checkbox
			  	  node-key="id"
				  :check-strictly="true"
				  :default-expand-all="true"
				  @check="check"
			  	  :default-checked-keys="checkKeys"
			  	  :props="defaultProps">
			  	</el-tree>
			  </div>
		  	<div class="position-absolute flex align-center px-3" style="bottom: 0; left: 0;  right: 0; height: 60px; z-index: 66;">
		  		<el-button  @click="drawer=false">取消</el-button>
		  		<el-button plain type="success" @click="submit">确定</el-button>
		  	</div>
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
			keyword: '',
			dynamicUrl: 'manager',
			managerList: [],
			roleList: [],
			ruleList: [],
			defaultProps: {
				children: 'child',
				label: 'name'
			},
			createModel: false,
			title: '',
			form: {
				manager: {
					username: '',
					password: '',
					avatar: '',
					role_id: 3,
					status: 1
				},
				role: {
					name: '',
					desc: '',
					status: 1
				},
				rule: {
					menu: 0,
					rule_id: 0,
					name: '',
					status: 1,
					frontpath: '',
					desc: '',
					condition: '',
					icon: '',
					method: 'GET',
					order: 50
				}
			},
			roleOptions: [],
			ruleOptions: [],
			editIndex: -1,
			drawer: false,//抽屉
			direction: 'rtl',//抽屉方向
			checkKeys:[],
			drawerId:0,
		};
	},
	filters: {
		tree(val) {
			if(!val)return 
			//根据 level 生成 |--  |---- 层级符号
			let str = '';
			if (val.level == 0) return val.name;
			for (let i = 0; i < val.level; i++) {
				str += i == 0 ? '|--' : '--';
			}
			return str + ' ' + val.name;
		}
	},
	methods: {
		//manager
		//mixin
		getMixinList(data) {
			switch (this.dynamicUrl) {
				case 'manager':
					this.managerList = data.list;
					this.roleOptions = data.role;
					break;
				case 'role':
					this.roleList = data.list;
					break;
				case 'rule':
					this.ruleList = data.list;
					this.ruleOptions = data.rules;
					break;
			}
		},
		editUrlVal() {
			//组件中没写这个方法 则不会覆盖
			if (this.dynamicUrl == 'manager') {
				return this.url.m(this.page.currentPage, `?limit=${this.page.pageSize}&keyword=${this.keyword}`)[this.dynamicUrl].init;
			}
			if (this.dynamicUrl == 'role') {
				return this.url.m(this.page.currentPage, `?limit=${this.page.pageSize}&keyword=${this.keyword}`)[this.dynamicUrl].init;
			}
			if (this.dynamicUrl == 'rule') {
				return this.url.m(this.page.currentPage, `?limit=${this.page.pageSize}&keyword=${this.keyword}`)[this.dynamicUrl].init;
			}
		},
		//搜索
		search() {
			this.__init();
		},
		//删除
		managerDelete(id) {
			this.deleteSku('single', id);
		},
		//打开 dialog
		openDialog(type, e = false) {
			switch (type) {
				case 'manager':
					//创建
					if (!e) {
						this.editIndex = 0;
						this.form.manager = {
							username: '',
							password: '',
							avatar: '',
							role_id: 3,
							status: 1
						};
					} else {
						this.editIndex = e.row.id;
						//修改
						this.form.manager = {
							...e.row
						};
					}
					break;
				case 'role':
					//创建
					if (!e) {
						this.editIndex = 0;
						this.form.role = {
							name: '',
							desc: '',
							status: 1
						};
					} else {
						this.editIndex = e.row.id;
						//修改
						this.form.role = {
							...e.row
						};
					}
					break;
					case 'rule':
						//创建
						if (!e||typeof e === 'number') {
							this.form.rule = {
								menu: 1,
								name: '',
								status: 1,
								frontpath: '',
								desc: '',
								condition: '',
								icon: '',
								method: 'GET',
								order: 50
							};
							this.form.rule.rule_id=e||0
							this.editIndex = 0;
						} else {
							
							this.editIndex = e.id;
							//修改
							this.form.rule = {
								...e
							};
						}
						break;
			}

			// 显示弹出层
			this.createModel = true;
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},
		//图像选择dialog
		openImgDialog() {
			this.app.openImgDialog(res => {
				this.form.manager.avatar = res.src;
			});
		},
		//确定
		ensure() {
			this.addOrEdit(this.form[this.dynamicUrl], this.editIndex); //mixins
			this.createModel = false;
		},

		//rule
		//打开抽屉
		openDrawer(row){
			this.drawer=true
			this.layout.isLoading(true)
			//分页，由于涉及到无限级分类，所以只有1页，直接填1即可
			new this.request(this.url.m(1).rule.init).modeget().then(res=>{
				this.layout.isLoading(false)
				this.ruleList = res.data.data.list
				this.checkKeys=row.rules.map(v=>v.id)
				this.drawerId=row.id
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		//tree 选中节点时
		check(...e){
			//选中时把当前选中节点的 id 传给 checkKeys 用于给角色配置权限
			this.checkKeys=e[1].checkKeys
		},
		//给角色配置权限
		submit(){
			this.layout.isLoading(true)
			new this.request(this.url.m(this.drawerId).role.set_rules,{rule_ids:this.checkKeys,id:this.drawerId}).modepost().then(res=>{
				this.__init()
				this.layout.isLoading(false)
				this.drawer=false
				this.$message.success('配置成功')
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		isShow(data) {
			data.status = data.status ? 0 : 1;
		},
	},
	computed: {
		isEditCom() {
			return data => {
				return data.edit ? '完成' : '修改';
			};
		}
	}
};
</script>

<style scoped="scoped">
</style>
