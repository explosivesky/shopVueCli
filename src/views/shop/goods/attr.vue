<template>
	<div class="position-absolute px-4 mt-3" style="top: 55px; left: 0; right: 0; bottom: 0;">
		<!-- 返回商品列表 -->
		<router-link :to="{ name: 'shop_goods_list' }" class="position-absolute" style="top: -58px; left: 170px;">
			<el-button icon="el-icon-arrow-left" size="mini">返回商品列表</el-button>
		</router-link>
		<el-form label-width="80px">
			<el-form-item label="商品类型">
				<el-select v-model="goods_id" @change="change" placeholder="请选择商品类型">
					<el-option :label="item.name" :value="item.id" v-for="(item, index) in typeOptions"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-card class="box-card">
			<div slot="header" class="clearfix"><span>商品属性</span></div>
			<el-form label-width="80px">
				<el-form-item :label="item.name" v-for="(item, index) in goods_type_values" :key="index">
					<el-input v-model="item.value" class="w-50" v-if="item.type === 'input'"></el-input>
					<el-radio-group v-model="item.value" v-else-if="item.type === 'radio'">
						<el-radio :label="item1" v-for="(item1, index1) in item.default" :key="index1"></el-radio>
					</el-radio-group>
					<el-checkbox-group v-model="item.value" v-else-if="item.type === 'checkbox'">
					 <el-checkbox :label="item1" v-for="(item1, index1) in item.default" :key="index1"></el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</el-card>
		<div class="position-fixed" style="bottom: 130px; right: 50px;">
			<el-button type="success" plain @click="onSubmit">提交</el-button>
		</div>
	</div>
</template>

<script>
export default {
	inject: ['layout'],
	data() {
		return {
			id: 0,
			typeOptions: [],
			goods_id: '',
			goods_type_values: []
		};
	},
	created() {
		this.id = this.$route.params.id;
		if (!this.id) {
			this.$message.warning('非法数据');
			this.$router.push({ name: 'shop_goods_list' });
			return;
		}
		this.layout.isLoading(true);
		new this.request(this.url.m(this.id).goods.read)
			.modeget()
			.then(res => {
				let data = res.data.data;
				this.typeOptions = data.types;
				this.goods_type_values=data.goodsAttrs.map(v=>{
					if(v.type!=='input')v.default = v.default.split(',')
					return v
				})
				this.layout.isLoading(false);
			})
			.catch(e => {
				this.layout.isLoading(false);
			});
	},
	methods: {
		change(id) {
			let index = this.typeOptions.findIndex(v => v.id === id);
			if (index === -1) return (this.goods_type_values = []);
			let options = this.typeOptions[index].goods_type_values;
			this.goods_type_values = options.map(v => {
				let defaultVal = [];
				if (v.type !== 'input') {
					defaultVal = v.default ? v.default.split(',')  : []
				}
				return {
					goods_id: this.id,
					value: '',
					name: v.name,
					default: defaultVal,
					type: v.type
				};
			});
		},
		onSubmit(){
			let goods_attrs = this.goods_type_values.map(v=>{
				if(v.type!=='input')v.default = v.default.join(',')
				return v
			})
			this.layout.isLoading(true);
			new this.request(this.url.m(this.id).goods.attrs,{goods_attrs})
				.modepost()
				.then(res => {
					this.layout.isLoading(false);
					this.$message.success('保存成功')
					this.$router.push({ name: 'shop_goods_list' });
				})
				.catch(e => {
					this.layout.isLoading(false);
				});
		}
	}
};
</script>

<style></style>
