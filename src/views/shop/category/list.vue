<template>
	<div class="position-absolute" style="top: 55px; left: 0; right: 0; bottom: 0;">
		<el-button type="success" @click="createLevel" class="my-2 ml-2" size="small">创建顶级分类</el-button>
		<div class="custom-tree-container">
			<div class="block">
				<el-tree :data="data" show-checkbox :props="defaultProps" @node-drag-end="nodeDragEnd" :draggable="true" default-expand-all node-key="id" @node-drop="nodeDrop" default-expand-all :expand-on-click-node="false">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span v-if="!data.edit">{{ node.label }}</span>
						<span v-else><el-input type="text" size="mini" v-model="data.name" class="position-relative" style="z-index: 9999;"></el-input></span>
						<span>
							<!-- 显示|隐藏 -->
							<el-button :type="!data.status ? 'primary' : 'warning'" size="mini" @click.stop="isShow(data)">{{ isShowCom(data) }}</el-button>
							<el-button type="success" size="mini" @click.stop="isAdd(data)">增加</el-button>
							<!-- 完成|修改 -->
							<el-button :type="data.edit == 1 ? '' : 'warning'" size="mini" @click.stop="isEdit(data)">{{ isEditCom(data) }}</el-button>
							<el-button type="danger" size="mini" @click.stop="isDelete(node, data)">删除</el-button>
						</span>
					</span>
				</el-tree>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			data: [],
			defaultProps: {
				children: 'child',
				label: 'name'
			}
		};
	},
	inject:['layout'],
	created() {
		this.__init();
	},
	methods: {
		__init() {
			this.layout.isLoading(true)
			new this.request(this.url.m().category).modeget().then(res => {
				let arr = res.data.data;
				function addEdit(arr) {
					arr.forEach(i => {
						i.edit = 0;
						if (i.child.length) {
							addEdit(i.child)
						}
					});
				}
				addEdit(arr);	
				this.data = arr
				this.layout.isLoading(false)
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		//显示|隐藏
		isShow(data) {
			let status = data.status ? 0 : 1;
			this.layout.isLoading(true)
			new this.request(this.url.m(data.id).update_status,{status}).modepost().then(res => {
				this.__init()
				this.$message.success('修改完成')
				this.layout.isLoading(false)
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		//修改 | 完成
		isEdit(data) {
			//edit 1 完成 ： 0 修改
			if(data.edit == 0){//如果修改 return 并 改为完成
				return data.edit = 1
			}
			let name = data.name.trim()
			let status = data.status
			let category_id = data.category_id
			if(data.name==''){
				this.$message.warning('名称不能为空')
				return
			}
			//请求修改名称
			this.layout.isLoading(true)
			new this.request(this.url.m(data.id).category,{status,name,category_id}).modepost().then(res => {
				data.edit=0
				this.__init()
				this.$message.success('修改完成')
				this.layout.isLoading(false)
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		//删除功能
		isDelete(node,data) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
						//删除请求
						this.layout.isLoading(true)
						new this.request(this.url.m(data.id).category).modedelete().then(res => {
							this.__init()
							this.$message.success('修改完成')
							this.layout.isLoading(false)
						}).catch(e=>{
							this.layout.isLoading(false)
						})
			        })
		},
		//增加
		isAdd(data) {
			if (!data.child) data.child = [];
			//增加请求
			this.layout.isLoading(true)
			new this.request(this.url.m().category,{status:0,name:'新子节点',category_id:data.id}).modepost().then(res => {
				let obj =res.data.data
				obj.edit=1//更改为修改状态，通过修改按钮 调用 __init 方法更新视图
				obj.child=[]//添加子节点
				data.child.push(obj)//添加到该层级节点的 child 属性中
				this.layout.isLoading(false)
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		//拖拽结束时
		nodeDragEnd(...postion){
			//规律： 顶级节点的category_id 要为 0 而非顶级节点的category_id 要为 非0
			// 被拖拽节点对应的 Node的数据
			let before = postion[0].data
			// 结束拖拽时最后进入的节点的数据（可能为空)
			let after =postion[1].data 
			//postion 第三个参数为 'before' | 'after' | 'inner'
			let type = postion[2]
			if(after){
				if(type=='before'||type=='after'){
					if(after.category_id==0)return before.category_id=0//设为顶级节点
					before.category_id = after.category_id
				}else{	
					//'inner'
					before.category_id=after.id
				}
			}
		},
		//拖拽完成时
		nodeDrop(...postion) {
			this.layout.isLoading(true)
			new this.request(this.url.m().sort,{sortdata:JSON.stringify(this.sort)}).modepost().then(res => {
				this.__init()
				this.layout.isLoading(false)
			}).catch(e=>{
				this.layout.isLoading(false)
			})
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
				this.layout.isLoading(true)
				new this.request(this.url.m().category,{status:0,name:value,category_id:0}).modepost().then(res => {
					this.__init()
					this.layout.isLoading(false)
				}).catch(e=>{
					this.layout.isLoading(false)
				})
			});
		}
	},
	computed: {
		isShowCom() {
			return data => {
				return data.status ? '隐藏' : '显示';
			};
		},
		isEditCom() {
			return data => {
				return data.edit ? '完成' : '修改';
			};
		},
		//因为 tree 空间拖拽时 数据也会跟着变化，所以可使用 计算属性 来操作
		//每次拖拽后 将 数据变成一维数组 作为 请求传递的数据
		sort(){
			let array = []
			function sortArr(arr){
				arr.forEach(i=>{
					array.push(i)
					if(i.child.length)sortArr(i.child)
				})
			}
			sortArr(this.data)
			//变为后台需要的参数形式 "[{'id':1,order:1,category_id:0}]"
			//order 就是 数组的索引
			array=array.map((item,index)=>{
				return{
					id:item.id,
					order:index,
					category_id:item.category_id
				}
			})
			return array
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
::v-deep .el-tree-node__content {
	padding: 25px 0;
}
</style>
