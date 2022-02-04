<template>
	<div>
		<el-form label-width="80px">
			<el-form-item label="商品类型">
				<el-select :value="goodsType" @change="vModelState({key:'goodsType',val:$event})" placeholder="请选择">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span>商品属性</span>
			</div>
			<el-form label-width="80px">
				<el-form-item label="输入框">
					<el-input :value="goodsAttr.type" @input="vModelGoodsAttr({key:'type',val:$event})" class="w-50"></el-input>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default{
		methods:{
			...mapMutations(['vModelState','vModelGoodsAttr'])
		},
		computed:{
			...mapState({
				goodsType:state=>state.goods_create.goodsType,
				goodsAttr:state=>state.goods_create.goodsAttr
			})
		}
	}
</script>

<style scoped="scoped">
	::v-deep .el-card__header{
		padding: 10px 20px !important;
	}
</style>
