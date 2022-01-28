<template>
	<el-dialog
	  title="商品图片选择"
	  :visible.sync="dialogVisible"
	  width="70%"
	  top="10vh"
	 >
	 <!--main -->
	 <el-container style="height: 70vh; position: relative; margin: -30px -20px;">
	 	<!-- 头部 -->
	 	<el-header class="bg-light">
	 		<div class="flex align-center" style="height: 100%;">
	 			<div class="flex align-center" style="margin-right: auto;">
	 				<el-select v-model="searchForm.order" placeholder="请选择排序方式" size="small" class="mr-2" style="width: 200px;">
	 					<el-option v-for="item in options" :key="item.value" :value="item.value"></el-option>
	 				</el-select>
	 				<el-input v-model="searchForm.val" placeholder="请输入相册名称" size="small" class="mr-2" style="width: 200px;"></el-input>
	 				<el-button type="success" size="small" class="mr-2">搜索</el-button>
	 			</div>
	 		</div>
	 	</el-header>
	 	<el-container>
	 		<!-- 侧边栏 -->
	 		<el-aside width="200px" style="position: absolute; top: 60px; left: 0; bottom: 60px;">
	 			<!-- 相册列表组 -->
	 			<ul class="list-group">
	 				<picture-info-list
	 					v-for="(c, c_i) in picture"
	 					:key="c.name"
	 					:item="c"
	 					:index="c_i"
	 					:currentIndex="currentIndex"
	 					@light="light"
							:isShow="false"
	 				/>
	 			</ul>
	 		</el-aside>
	 		<el-container>
	 			<!-- main -->
	 			<el-main class="" style="position: absolute; top: 60px; left: 200px; right: 0; bottom: 0;">
	 				<el-row :gutter="10">
	 					<el-col :span="24" :lg="4" :md="6" :sm="8" :xs="24" v-for="(s, s_i) in srcList" :key="s_i">
	 						<img-list :srcList="s" :index="s_i" @openPrompt="openPrompt" @deleteImg="deleteImg" @checkStyle="checkStyle" :isShow="false"/>
	 					</el-col>
	 				</el-row>
	 				<div style="height: 40px;">
	 					
	 				</div>
	 			</el-main>
	 		</el-container>
	 	</el-container>
	 	<!-- 页尾 -->
	 	<el-footer class="p-0" style="position: absolute; left: 0; right: 0; bottom: 0; background-color: #f8f9fa;">
	 		<div class="flex align-center">
	 			<div class="border-right flex align-center justify-center" style="width: 200px; height: 60px;">
	 				<el-button-group>
	 					<el-button  class="mr-2" size="mini">上一页</el-button>
	 					<el-button  size="mini">下一页</el-button>
	 				</el-button-group>	
	 			</div>
	 			<div class=" flex-1 px-3 flex align-center justify-between">
	 				<el-pagination
	 				      @size-change="handleSizeChange"
	 				      @current-change="handleCurrentChange"
						  class="flex"
	 				      :current-page="currentPage4"
	 				      :page-sizes="[100, 200, 300, 400]"
	 				      :page-size="100"
	 				      layout="total, sizes, prev, pager, next, jumper"
	 				      :total="400">
	 				    </el-pagination>
						<span slot="footer" class="dialog-footer">
						  <el-button @click="hide" size="mini">取 消</el-button>
						  <el-button type="success" @click="confirm" size="mini">确 定</el-button>
						</span>
	 			</div>
	 		</div>
	 	</el-footer>
	 </el-container>
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
			handleSizeChange(val) {
			        console.log(`每页 ${val} 条`);
			      },
			      handleCurrentChange(val) {
			        console.log(`当前页: ${val}`);
			      },
			//列表高亮
			light(index) {
				this.currentIndex = index;
			},
			//删除相册列表 || 删除图片
			deleteModel(index, type) {
					this.srcList.splice(index, 1);
			},
			//确认删除消息框
			openMsgBox(index, type, obj = null) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if (type == 'deleteImg') {
						//删除图片
						//删除图片后更新选中样式
						if (this.chooseList.length) this.checkStyle(obj);
						this.deleteModel(index, type);
					} else if (type == 'deleteAll') {
						//批量删除
						let arr = this.srcList.filter(i => !i.isCheck);
						this.srcList = arr;
							//清空选中的数组
						this.chooseList = [];
					}
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				});
			},
			//修改 | 添加相册
			editModel() {
				if (this.pictureIndex > -1) {
					//修改相册数据
					this.picture[this.pictureIndex].name = this.dialogForm.input;
					this.picture[this.pictureIndex].num = this.dialogForm.num;
				} else {
					//创建相册
					this.picture.unshift({
						name: this.dialogForm.input,
						num: this.dialogForm.num
					});
				}
			
				//初始化相册信息
				(this.dialogForm.input = ''), (this.dialogForm.num = 0), (this.dialogVisible = false), (this.pictureIndex = -1);
			},
			//计数器
			handleChange() {},
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
			//删除图片
			deleteImg(index, obj) {
				this.openMsgBox(index, 'deleteImg', obj);
			},
			//选中样式
			checkStyle(obj) {
				//控制选中图片的数量
				if(this.chooseList.length  >= this.max){
					this.$message({type:'warning',message:`选择图片最多${this.max}张`})
					return 
				}
				let { name, id, checkState, isCheck, checkTag ,src } = obj;
				// 根据当前 选中的 item 中的 id 判断 srcList 对应 id 的索引，并根据索引 修改 srcList 中的 isCheck 里更新 子组件的 是否选中样式
				let index = this.srcList.findIndex(i => i.id === id);
				//没选中的
				if (checkState === -1) {
					this.srcList[index].isCheck = !isCheck;
					this.srcList[index].checkState = id;
					// 把选中的放到 choose 数组中
					this.chooseList.push({ name, checkState, id ,src});
					//tag 就是 数组的长度
					this.srcList[index].checkTag = this.chooseList.length;
					return;
				}
				//选中过的
				this.srcList[index].isCheck = !isCheck;
				this.srcList[index].checkState = -1;
				let chooseIndex = this.chooseList.findIndex(i => i.id === id);
				// 根据当前 选中的 item 中的 id 和 choose 数组中的 id 来判断 删除 choose 数组的项并更新 tag
				this.chooseList.splice(chooseIndex, 1);
				//判断取消的是不是最大数，也就是最后一个，如果是就不用再往下操作了
				//if(chooseIndex+1 == this.chooseList.length) return
				//如果不是就对 chooseIndex 后面的元素进行操作
				for (let j = chooseIndex; j < this.chooseList.length; j++) {
					index = this.srcList.findIndex(i => i.id === this.chooseList[j].id);
					if (index > -1) {
						this.srcList[index].checkTag--;
					}
				}
			},
			//取消选中
			cancelChoose() {
				//取消选中
				if(this.chooseList.length){
					this.srcList.forEach(i => {
						if (i.isCheck) {
							i.isCheck = false;
							i.checkTag = 0;
							i.checkState=-1
						}
					});
					this.chooseList = [];
				}
			
			}
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
</style>
