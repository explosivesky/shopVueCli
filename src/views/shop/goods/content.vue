<template>
	<div class="position-absolute" style="top: 55px; left: 0; right: 0; bottom: 0;">
		<!-- 返回商品列表 -->
		<router-link :to="{ name: 'shop_goods_list' }" class="position-absolute" style="top: -43px; left: 200px;">
			<el-button icon="el-icon-arrow-left" size="mini">返回商品列表</el-button>
		</router-link>
		<!-- 富文本 -->
		<tinymce ref="editor" v-model="content" @onClick="onClick" toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists table | removeformat | imageUpload"/>
			<div class="position-fixed" style="bottom: 130px; right: 50px;">
				<el-button type="success" plain @click="onSubmit">提交</el-button>
			</div>
	</div>
</template>

<script>
import tinymce from '@/components/common/tinymce.vue';
export default {
	inject:['layout'],
	data() {
		return {
			content: '',
			id:0
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
			this.content=res.data.data.content
			this.layout.isLoading(false)
		}).catch((e=>{
			this.layout.isLoading(false)
		}))
	},
	methods: {
		// 鼠标单击的事件
		onClick(e, editor) {
			console.log('Element clicked');
			console.log(e);
			console.log(editor);
		},
		onSubmit(){
			this.layout.isLoading(true)
			new this.request(this.url.m(this.id).goods.add_or_edit,{content:this.content}).modepost().then(res=>{
				this.layout.isLoading(false)
				this.$message.success('保存成功')
				this.$router.push({name:'shop_goods_list'})
			}).catch((e=>{
				this.layout.isLoading(false)
			}))
		}
	},
	components: {
		tinymce,
	}
};
</script>

<style>
</style>
