<template>
	<div class="position-absolute" style="top: 55px; left: 0; right: 0; bottom: 0;">
		<el-button type="success" @click="createLevel" class="my-2 ml-2" size="small">创建顶级分类</el-button>
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
		      :expand-on-click-node="false">
		      <span class="custom-tree-node" slot-scope="{ node, data }">
		        <span v-if="!data.edit">{{ node.label }}</span>
		        <span v-else>
					<el-input type="text" size="mini" v-model="data.label"></el-input>
				</span>
		        <span>
		          <el-button :type="!data.status ? 'primary' : 'warning'" size="mini" @click.stop="isShow(data)">{{isShowCom(data)}}</el-button>
		          <el-button type="success"size="mini" @click.stop="isAdd(data)">增加</el-button>
		          <el-button :type="data.edit== 1 ? '': 'warning'"size="mini" @click.stop="isEdit(data)">{{isEditCom(data)}}</el-button>
		          <el-button type="danger"size="mini" @click.stop="isDelete(node,data)">删除</el-button>
		        </span>
		      </span>
		    </el-tree>
		  </div>
		</div>
	</div>
</template>

<script>
	export default{
		   data() {
		      const data = [{
		        id: 1,
		        label: '一级 1',
				status:0,
				edit:0,
		        children: [{
		          id: 4,
		          label: '二级 1-1',
				  status:0,
				  edit:0,
		          children: [{
		            id: 9,
		            label: '三级 1-1-1',
					status:0,
					edit:0,
		          }, {
		            id: 10,
		            label: '三级 1-1-2',
					status:0,
					edit:0,
		          }]
		        }],
				}];
		      return {
		        data: JSON.parse(JSON.stringify(data)),
		        data: JSON.parse(JSON.stringify(data))
		      }
		    },
			methods:{
				isShow(data){
					console.log(data)
					data.status = data.status ? 0 : 1
				},
				isEdit(data){
					data.edit = data.edit ? 0 : 1
				},
				isDelete(node,data){
					console.log(node)
					let parent = node.parent
					let childNodes = parent.childNodes
					let index = childNodes.findIndex(v => v.data.id == data.id)
					if(index == -1 ) return
					childNodes.splice(index,1)
				},
				isAdd(data){
					console.log(data)
					if(!data.children)data.children=[]
					data.children.push({
						id: 22,
						label: '二级 3-2',
						status:1,
						edit:1,
						children:[]
					})
				},
				nodeDrop(...event){
					console.log(event)
				},
				//创建顶级分类
				createLevel(){
					      this.$prompt('请输入顶级分类名称', '提示', {
					          confirmButtonText: '确定',
					          cancelButtonText: '取消',
							  inputValidator(val){
								  if(val=='' || val ==null){
									  return '顶级分类名称不能为空'
								  }
							  }
					        }).then(({ value }) => {
								//提交服务器
								console.log(value)
					        })
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
	}
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
