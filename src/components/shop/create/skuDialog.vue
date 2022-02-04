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
			<el-button type="success" size="mini" @click="cancelChoose(isTotalCheck)">{{isTotalCheck ? '全部取消' : '全部选中'}}</el-button>
	 	</el-header>
	 	<el-container>
	 		<!-- 侧边栏 -->
	 		<el-aside class="bg-light" width="200px" style="position: absolute; top: 0; left: 0; bottom: 0;">
	 			<!-- 相册列表组 -->
				<ul class="list-group">
					<li class="list-group-item bg-light list-group-item-action" v-for="(item,index) in skuList" :key="index" @click="skuListCheck(index)" :class="currentIndex == index ? 'hover' : ''">{{item.name}}</li>
				</ul>
	 		</el-aside>
	 		<el-container>
	 			<!-- main -->
	 			<el-main class="flex" style="position: absolute; top: 60px; left: 200px; right: 0; bottom: 0;">
					<div class="" v-for="(item,index) in list" :key="item.id" >
						<span class="px-4 py-2 rounded border mx-3 cursor-pointer" @click="skuItemCheck(item)" :class="item.isCheck ? 'hover' : ''">
							{{item.name}}
						</span>
					</div>
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
				  currentIndex: 0,
				  chooseList: [],
				  skuList: [{
				  		name: '颜色', //规格项
				  		group: 0,
				  		type: 'default', // default 无 ： color 颜色 ： img 图片
				  		list: [{
								id:1,
				  				name: '红色',
				  				image: '',
				  				color: '',
				  				isShow: false,
								isCheck:false,
				  				default: 'default0'
				  			},
				  			{
								id:2,
				  				name: '黄色',
				  				image: '',
				  				color: '',
				  				isShow: false,
								isCheck:false,
				  				default: 'default1'
				  			}
				  		]
				  
				  	},
				  	{
				  		name: '尺寸', //规格项
				  		group: 1,
				  		type: 'default', // default 无 ： color 颜色 ： img 图片
				  		list: [{
								id:3,
				  				name: 'XL',
				  				image: '',
				  				color: '',
				  				isShow: false,
								isCheck:false,
				  				default: 'default2'
				  			},
				  			{
								id:4,
				  				name: 'XXL',
				  				image: '',
				  				color: '',
				  				isShow: false,
								isCheck:false,
				  				default: 'default3'
				  			}
				  		]
				  
				  	}
				  ],
				  list:[],
			  }
		},
		methods:{
			//全部选中
			totalCheck(){
				
			},
			//列表选中时
			skuListCheck(index){
				this.currentIndex = index
				this.list=this.skuList[index].list
				this.cancelChoose(true)
			},
			//列表中的每一项选中时
			skuItemCheck(item){
				//没选过
				if(!item.isCheck){
					this.chooseList.push(item)
					return item.isCheck=true
				}
				//之前选中过 就取消选中 并从 chooseList 删除这一项
				 let index = this.chooseList.findIndex(v=>v.id === item.id)
				 //找不到
				 if(index < 0) return
				 this.chooseList.splice(index,1)
				item.isCheck=false
			},
			//dialog
			open(callback){
					  this.callback=callback
					this.dialogVisible=true
			},
			//确定
			confirm(){
					//选中图片 url
					if(typeof this.callback === 'function'){
						let item = this.skuList[this.currentIndex]
						this.callback({
							name:item.name,
							type:item.type,
							list:item.list
						})
					}
					//隐藏  
					this.hide()
			},
			hide(){
					this.cancelChoose(true)
					this.dialogVisible=false
					this.callback=false
			},
			//全部选中
			cancelChoose(tag) {
				if(!tag){
					this.chooseList = this.list.map(i=>{
						if(!i.ischeck){
							i.isCheck=true
						}
						return i
					})
				}else{
					this.chooseAll()
				}
				
			},
			//取消选中
			chooseAll(){
				this.list.forEach(i => {
					if (i.isCheck) {
						i.isCheck = false;
					}
				});
				this.chooseList = [];
			}
		},
		components: {
			pictureInfoList,
			imgList,
		},
		computed:{
			isTotalCheck(){
				return this.list.length === this.chooseList.length ? true : false
			}
		},
		mounted(){
			this.skuListCheck(0)
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
