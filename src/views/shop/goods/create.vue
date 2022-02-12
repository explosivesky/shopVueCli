<template>
	<div class="position-absolute px-4 mt-3" style="top: 60px; left: 0; right: 0; bottom: 0;">
		<!-- 返回商品列表 -->
		<router-link :to="{ name: 'shop_goods_list' }" class="position-absolute" style="top: -64px; left: 170px;">
			<el-button icon="el-icon-arrow-left" size="mini">返回商品列表</el-button>
		</router-link>
				<!-- form表单 -->
				<el-form label-position="left" label-width="80px">
					<el-form-item label="商品名称">
						<el-input v-model="form.title" size="medium"placeholder="请输入商品名称,不能超过60个字符" class="w-50"></el-input>
					</el-form-item>
					<el-form-item label="头像">
						<template slot-scope="scope">
							<div class="flex align-center justify-center border rounded p-0 cursor-pointer" style="height: 50px; width: 50px;" @click="openImgDialog">
								<div class="position-relative" style="height: 100%; width: 100%;" v-if="form.cover">
									<img :src="form.cover" class="w-100" style="height: 100%;" />
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
					<el-form-item label="商品分类">
						 <el-select v-model="form.category_id"
							placeholder="请选择商品分类">
							<el-option :label="item | tree" v-for="(item,index) in cates" :key="index"
							:value="item.id"></el-option>
						 </el-select>
					</el-form-item>
					<el-form-item label="商品描述" class="w-50">
						<el-input
							type="textarea"
							v-model="form.desc"
							placeholder="选填，商品卖点简述，例如：此款商品美观大方 性价比较高 不容错过"
							size="medium"
						></el-input>
					</el-form-item>
					<el-form-item label="商品单位" class="w-25">
						<el-input v-model="form.unit" size="medium" type="text" placeholder="请输入商品单位"></el-input>
					</el-form-item>
					<el-form-item label="总库存" class="w-25">
						<el-input v-model="form.stock" type="text">
							<template slot="append">
								件
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="库存预警" class="w-25">
						<el-input v-model="form.min_stock" type="text">
							<template slot="append">
								件
							</template>
						</el-input>
					</el-form-item>
						<el-form-item label="最低销售价">
									<el-input type="number" v-model="form.min_price" class="w-25">
										<template slot="append">元</template>
									</el-input>
								</el-form-item>
								<el-form-item label="最低原价">
									<el-input type="number" v-model="form.min_oprice" class="w-25">
										<template slot="append">元</template>
									</el-input>
								</el-form-item>
					<el-form-item label="库存显示">
						<el-radio-group v-model="form.stock_display" size="medium">
							<el-radio border :label="1">是</el-radio>
							<el-radio border :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="是否上架">
						<el-radio-group v-model="form.status" size="medium">
							<el-radio border :label="0">放入仓库</el-radio>
							<el-radio border :label="1">立即上架</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="运费模板">
						<el-select v-model="form.express_id" placeholder="请选择运费模板">
							<el-option :label="item.name" v-for="(item,index) in express" :key="index" :value="item.id"></el-option>
						</el-select>
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
			id: 0,
			cates: [],
			express: [],
			form: {
				title: '',
				category_id: '',
				cover: '',
				desc: '',
				unit: '',
				stock: '',
				min_stock: '',
				ischeck: 0,
				status: 0,
				stock_display: 0,
				express_id: '',
				min_price: '',
				min_oprice: ''
			}
		};
	},
	created(){
		//页面主数据
		this.id = this.$route.params.id || 0
		if(this.id){
			this.layout.isLoading(true)
			new this.request(this.url.m(this.id).goods.read).modeget().then(res=>{
				let data = res.data.data
				let form={}
				for(let key in data){
					if(this.form.hasOwnProperty(key))
					form[key]=data[key]
				}
				this.form=form
				this.layout.isLoading(false)
			}).catch((e=>{
				this.layout.isLoading(false)
			}))
		}
		//选择框数据
		this.layout.isLoading(true)
		new this.request(this.url.m().goods.create).modeget().then(res=>{
			let data = res.data.data
			this.cates = data.cates
			this.express = data.express.list
			this.layout.isLoading(false)
		}).catch((e=>{
			this.layout.isLoading(false)
		}))
	},
	filters:{
		tree(val){
			if(val.level==0) return val.name
			let str=''
			for (let i = 0; i < val.level; i++) {
				str+= i == 0 ? '|--' : '--'
			}
			return str +' '+ val.name
		}
	},
	methods: {
		//图像选择dialog
		openImgDialog() {
			this.app.openImgDialog(res => {
				this.form.cover = res.src;
			});
		},
		//发布商品
		onSubmit() {
			let url = this.id ? this.url.m(this.id).goods.add_or_edit:this.url.m().goods.add_or_edit
			this.layout.isLoading(true)
			new this.request(url,this.form).modepost().then(res=>{
				this.layout.isLoading(false)
				this.$message.success(this.id ? '修改成功' : '发布成功')
				this.$router.push({name:'shop_goods_list'})
			}).catch((e=>{
				this.layout.isLoading(false)
			}))
		},
		//删除表单图片
		deleteImg() {
			this.form.cover = '';
		},
	},
};
</script>

<style>
</style>
