<template>
	<el-dialog
	  title="商品规格选择"
	  :visible.sync="dialogVisible"
	  width="70%"
	  top="10vh"
	   >
	 <!--main -->
	 <el-container style="height: 70vh; position: relative; margin: -30px -20px;">
	 	<!-- 头部 -->
	 	<el-header class="bg-light border-bottom flex align-center" style="position: absolute; top: 0; left: 200px; right: 0;">
			<el-button type="success" @click="totalCheck" size="mini">全部选中</el-button>
	 	</el-header>
	 	<el-container>
	 		<!-- 侧边栏 -->
	 		<el-aside class="bg-light" width="200px" style="position: absolute; top: 0; left: 0; bottom: 0;">
	 			<!-- 相册列表组 -->
	 			<ul class="list-group">
	 				<li class="list-group-item bg-light hover">1</li>
	 				<li class="list-group-item bg-light">1</li>
	 				<li class="list-group-item bg-light">1</li>
	 				<li class="list-group-item bg-light">1</li>
	 			</ul>
	 		</el-aside>
	 		<el-container>
	 			<!-- main -->
	 			<el-main class="" style="position: absolute; top: 60px; left: 200px; right: 0; bottom: 0;">
	 			</el-main>
	 		</el-container>
	 	</el-container>
	 </el-container>
	 <span slot="footer" class="dialog-footer flex justify-end align-center" style=" height: 58px;">
	   <el-button @click="hide" size="mini">取 消</el-button>
	   <el-button type="success" @click="confirm" size="mini">确 定</el-button>
	 </span>
	</el-dialog>
</template>

<script>
import pictureInfoList from '@/components/image/pictureInfoList.vue';
import imgList from '@/components/image/imgList.vue';
	export default{
		data(){
			  return{
				  callback:false,
				  dialogVisible: false,
				  currentPage4: 4,
				  // action: '',
				  searchForm: {
				  	val: '',
				  	order: ''
				  },
				  dialogForm: {
				  	input: '',
				  	num: 0
				  },
				  options: [
				  	{
				  		value: '顺序排序'
				  	},
				  	{
				  		value: '倒序排序'
				  	}
				  ],
				  picture: [],
				  currentIndex: 0,
				  pictureIndex: -1,
				  srcList: [],
				  chooseList: [],
				  max:0,//最多选中图片数量
			  }
		},
		methods:{
			//全部选中
			totalCheck(){
				
			},
			//dialog
			open(callback,max=1){
					  this.callback=callback
					this.dialogVisible=true
					this.max=max
			},
			//确定
			confirm(){
					//选中图片 url
					if(typeof this.callback === 'function')this.callback(...this.chooseList)
					//隐藏  
					this.hide()
			},
			hide(){
					this.cancelChoose()
					this.dialogVisible=false
					this.callback=false
			},
			//打开prompt
			openPrompt(id) {
				let index = this.srcList.findIndex(i => i.id === id);
				this.$prompt('请输入图片信息', '修改图片信息', {
					showClose: false,
					closeOnClickModal: false,
					inputValue: this.srcList[this.srcList.findIndex(i => i.id === id)].name,
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					this.srcList[this.srcList.findIndex(i => i.id === id)].name = value;
					this.$message({
						type: 'success',
						message: '修改成功'
					});
				});
			},
		},
		components: {
			pictureInfoList,
			imgList,
		},

  created() {
  	for (let i = 0; i < 30; i++) {
  		this.picture.push({
  			// id: i,
  			name: '相册 ' + i,
  			modelIndex: -1,
  			num: Math.floor(Math.random(0, 1) * 100)
  		});
  	}
  	for (let i = 0; i < 40; i++) {
  		this.srcList.push({
  			id: i,
  			src: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
  			name: '图片' + i,
  			checkTag: 0,
  			isCheck: false,
  			checkState: -1
  		});
  	}
  }
	}
</script>

<style>
	.el-dialog__footer{
		padding: 0 1.25rem;
		background-color: #f7f7f7;
		    border-top-width: 1px;
		    border-top-style: solid;
		    border-top-color: #dee2e6;
	}
	.el-dialog__header{
		background-color: #f7f7f7;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #dee2e6;
	}
</style>
