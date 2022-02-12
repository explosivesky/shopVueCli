<template>
	<div class="position-absolute px-4" style="top: 55px; left: 0; right: 0; bottom: 0;">
		<!-- 返回商品列表 -->
		<router-link :to="{ name: 'shop_goods_list' }" class="position-absolute" style="top: -43px; left: 170px;">
			<el-button icon="el-icon-arrow-left" size="mini">返回商品列表</el-button>
		</router-link>
		<el-form ref="form" label-width="80px" class="mt-3">
			<el-form-item label="商品大图">
				<el-row :gutter="20" class="flex flex-wrap">
					<el-col :span="24" :lg="4" :md="6" :sm="8" :xs="24" v-for="(item, index) in banners" :key="index">
						<div class="flex align-center justify-center border rounded mx-4 my-2 p-0 cursor-pointer" style="height: 150px; width: 150px;" @click="openImgDialog">
							<div class="position-relative" style="height: 150px; width: 150px;" v-if="item.url">
								<img :src="item.url" class="w-100" style="height: 100%;" />
								<div
									class="btn position-absolute el-icon-delete flex justify-center align-center text-white"
									style="height: 25px; width: 25px; right: 0; top: 0;background-color: rgba(0,0,0,.5); z-index: 12;"
									@click.stop="deleteImg(index)"
								></div>
							</div>
							<span v-else class="el-icon-plus" style="font-size: 30px;"></span>
						</div>
					</el-col>
					<el-col v-if="banners.length < 9" :span="24" :lg="4" :md="6" :sm="8" :xs="24">
						<div class="flex align-center justify-center border rounded mx-4 my-2 p-0 cursor-pointer" style="height: 150px; width: 150px;" @click="openImgDialog">
							<span class="el-icon-plus" style="font-size: 30px;"></span>
						</div>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>
		<div class="position-fixed" style="bottom: 130px; right: 50px;">
			<el-button type="success" plain @click="onSubmit">提交</el-button>
		</div>
	</div>
</template>

<script>
export default {
	inject:['layout','app'],
	data() {
		return {
			id:0,
			banners:[]
		};
	},
	created(){
		this.id = this.$route.params.id
		if(!this.id){
			 this.$message.warning('非法数据')
			 this.$router.push({name:'shop_goods_list'})
			 return
		}
		this.layout.isLoading(true)
		new this.request(this.url.m(this.id).goods.read).modeget().then(res=>{
			this.banners = res.data.data.goodsBanner
			this.layout.isLoading(false)
		}).catch((e=>{
			this.layout.isLoading(false)
		}))
	},
	methods: {
		onSubmit(){
			let banners = this.banners.map(v=>v.url)
			this.layout.isLoading(true)
			new this.request(this.url.m(this.id).goods.banners,{banners}).modepost().then(res=>{
				this.layout.isLoading(false)
				this.$message.success('保存成功')
				this.$router.push({name:'shop_goods_list'})
			}).catch((e=>{
				this.layout.isLoading(false)
			}))
		},
		openImgDialog() {
			let max = 999;
			max = max - this.banners.length;
			this.app.openImgDialog((...res) => {
				res = res.map(v=>{
					v.url = v.src
					return v
				})
				this.banners = [...this.banners, ...res];
			}, max);
		},
		//删除商品大图
		deleteImg(index) {
			this.$confirm('是否该删除图片?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.banners.splice(index, 1);
			});
		}
	},
};
</script>

<style>
.el-textarea__inner {
	height: 120px;
}
</style>
