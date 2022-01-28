<template>
<div>
	<el-form-item label="市场价格" class="w-25">
		<el-input :value="marketPri" @input="vmodel('marketPri', $event)" type="text">
			<template slot="append">
				元
			</template>
		</el-input>
	</el-form-item>
	<el-form-item label="销售价格" class="w-25">
		<el-input :value="sellPri" @input="vmodel('sellPri', $event)" type="text">
			<template slot="append">
				元
			</template>
		</el-input>
	</el-form-item>
	<el-form-item label="成本价格" class="w-25">
		<el-input :value="costPri" @input="vmodel('costPri', $event)" type="text">
			<template slot="append">
				元
			</template>
		</el-input>
	</el-form-item>
	<el-form-item label="商品重量" class="w-25">
		<el-input :value="weight" @input="vmodel('weight', $event)" type="text">
			<template slot="append">
				元
			</template>
		</el-input>
	</el-form-item>
	<el-form-item label="商品体积" class="w-25">
		<el-input :value="bulk" @input="vmodel('bulk', $event)" type="text">
			<template slot="append">
				元
			</template>
		</el-input>
	</el-form-item>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	methods: {
		...mapMutations(['vModelState']),
		vmodel(key, val) {
			this.vModelState({ key, val });
		}
	},
	computed: {
		...mapState({
			//单一
			marketPri:state=>state.goods_create.marketPri,
			sellPri:state=>state.goods_create.sellPri,
			costPri:state=>state.goods_create.costPri,
			weight:state=>state.goods_create.weight,
			bulk:state=>state.goods_create.bulk
		})
	}
};
</script>

<style></style>
