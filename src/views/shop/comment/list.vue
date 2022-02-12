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
				<search-box placeholder="要搜索的商品名称" @search="search" class="pt-2" :showSuperSearch="false">
					<!-- 右边 -->
					<template #right></template>
				</search-box>
				<!-- tabel 表格 -->
				<el-table
					ref="multipleTable"
					:data="tableData"
					tooltip-effect="dark"
					height="700"
					border
					style="width: 100%"
					class="mt-2 pb-1"
				>
					<el-table-column align="center" type="expand" width="55">
						<template slot-scope="scope">
							<div class="media px-5">
							 <img src="http://static.yoshop.xany6.com/2018071718294208f086786.jpg" class="mr-3 img-cover border" style="width: 60px; height: 60px; border-radius: 100%;" />
							  <div class="media-body">
							    <div class="flex justify-between">
							    	<h6 class="mt-0">用户名 <small>{{scope.row.review_time}}</small></h6>
									<el-button type="danger" size="mini" v-if="!scope.row.extra" @click="response=true">回复</el-button>
							    </div>
								<p>{{scope.row.review.data}}</p>
								<div class="">
									<img :src="item" v-for="(item,index) in scope.row.review.image" :key="index" style="max-width: 100px; max-height: 50px;">
								</div>
							    <div class="media mt-3  bg-light p-2 rounded" v-if="scope.row.extra||response">
							      <div class="media-body " v-for="(item,index) in scope.row.extra" :key="index">
									  <div class="flex justify-between">
									  	<h6 class="mt-0 font-weight-bold font-sm">客服 </h6>
										<el-button type="info" size="mini" @click="editText(item.data)" v-if="textAreaEdit">修改</el-button>
									  </div>
							        <p class="m-0" v-if="textAreaEdit">回复内容：{{item.data}}</p>
									<div class="" v-else>
										<el-input v-model="textArea" type="textarea" placeholder="请输入回复内容"></el-input>
										<div class="">
											<el-button type="success" @click="onSubmit(scope.row.id)">回复</el-button>
											<el-button type="danger" @click="close">取消</el-button>
										</div>
									</div>
							      </div>
							    </div>
								
							  </div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="ID" align="center" prop="id" width="80"></el-table-column>
					<el-table-column label="商品" show-overflow-tooltip>
						<template slot-scope="scope">
							<div class="media">
								<img :src="scope.row.goods_item.cover" class="mr-3" style="width: 70px; height: 80px; " />
								<div class="media-body">
									<p class="mb-1">{{ scope.row.goods_item.title }}</p>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column align="left" label="评价信息" width="200" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>用户名 : {{scope.row.username}}</span>
							<div>
								评分 :
							</div>
							<el-rate
							  v-model="scope.row.goods_item.rating"
							  disabled
							  show-score
							  text-color="#ff9900"
							  score-template="{value}">
							</el-rate>
						</template>
					</el-table-column>
					<el-table-column prop="review_time" label="评价时间" width="180" align="center" show-overflow-tooltip>
						</el-table-column>
					<el-table-column prop="isShow" label="是否显示" width="140" align="center" show-overflow-tooltip>
						<template slot-scope="scope">
						<el-button :type="scope.row.status ? 'warning' : 'success'" size="mini" @click="isBan(scope.row)">{{ scope.row.status ? '禁用' : '启用' }}</el-button>
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
	</div>
</template>

<script>
import searchBox from '@/components/searchBox/searchBox.vue';
import mixin from '@/common/mixins'
export default {
	inject:['layout'],
	mixins:[mixin],
	data() {
		return {
			isShow: false,
			tableData:[],
			// tableData: [{
			// 	id:0,
			// 	goods:{
			// 		cover:'http://static.yoshop.xany6.com/2018071718294208f086786.jpg',
			// 		title:'商品标题'
			// 	},
			// 	userName:'用户名',
			// 	star:5,
				
			// }],
			dynamicUrl:'goods_comment',
			textAreaEdit:true,
			textArea:'',
			response:false,
			title:''
		};
	},
	methods: {
		getMixinList(data) {
			this.tableData = data.list
		},
		//修改客服回复
		editText(data){
			this.textAreaEdit=false
			this.textArea=data
		},
		//发布回复内容
		onSubmit(id){
			this.layout.isLoading(true)
			new this.request(this.url.m(id).goods_comment.review, {
				data: this.textArea
			}).modepost().then(res => {
				this.textAreaEdit=true
				this.$message.success('回复成功')
				this.__init()
			}).catch(e=>{
				this.layout.isLoading(false)
			})
		},
		//取消评论
		close(){
			this.textAreaEdit=true
			this.response=false
		},
		//普通搜索
		search(e) {
			this.title=e
			//普通搜索
			if (e.trim().toString() === '')return this.$message.warning('不能为空')
			//init 的动态 url
			this.__init()
		},
		editUrlVal() {
			//组件中没写这个方法 则不会覆盖
			return this.url.m(this.page.currentPage, '?limit=' + this.page.pageSize+'&title='+this.title)[this.dynamicUrl].init
		}
	},
	components: {
		searchBox
	}
};
</script>

<style></style>
