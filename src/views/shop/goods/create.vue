<template>
	<div class="position-absolute px-4" style="top: 55px; left: 0; right: 0; bottom: 0;">
		<!-- 返回商品列表 -->
		<router-link :to="{ name: 'shop_goods_list' }" class="position-absolute" style="top: -43px; left: 170px;">
			<el-button icon="el-icon-arrow-left" size="mini">返回商品列表</el-button>
		</router-link>
		<!-- 标签页 -->
		<el-tabs v-model="createTabIndex" @tab-click="handleClick">
			<!-- 基础设置 -->
			<el-tab-pane label="基础设置"><base-create /></el-tab-pane>
			<!-- 商品规格 -->
			<el-tab-pane label="商品规格">
				<!-- form表单 -->
				<el-form label-position="left" label-width="80px">
					<el-form-item label="商品规格">
						<el-radio-group size="small" :value="rulesType" @input="vmodel('rulesType', $event)">
							<el-radio-button :label="0">多规格</el-radio-button>
							<el-radio-button :label="1">单一规格</el-radio-button>
						</el-radio-group>
					</el-form-item>
					<!-- 多规格 -->
					<template v-if="!rulesType">
						<el-form-item label="添加规格">
							<!-- 卡片 -->
							<card-sku v-for="(s, s_i) in skuList" :key="s_i" :item="s" :index="s_i" :total="skuListTotal" :skuList="skuList" />
							<div><el-button size="mini" type="success" @click="skuAdd">添加规格</el-button></div>
						</el-form-item>
						<el-form-item label="批量设置">
							<el-button type="text">销售价</el-button>
							<el-button type="text">市场价</el-button>
							<el-button type="text">成本价</el-button>
							<el-button type="text">库存</el-button>
							<el-button type="text">体积</el-button>
							<el-button type="text">重量</el-button>
						</el-form-item>
						<el-form-item label="规格设置">
							<!-- table表格 -->
							<sku-table></sku-table>
						</el-form-item>
					</template>
					<!-- 单规格 -->
					<template v-else>
						<single />
					</template>
				</el-form>
			</el-tab-pane>

			<el-tab-pane label="商品属性">商品属性</el-tab-pane>
			<el-tab-pane label="媒体设置">媒体设置</el-tab-pane>
			<el-tab-pane label="商品详情">
				<!-- 富文本 -->
				<tinymce ref="editor" v-model="msg" @onClick="onClick" />
			</el-tab-pane>
			<el-tab-pane label="折扣设置">折扣设置</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import single from '@/components/shop/create/single.vue';
import baseCreate from '@/components/shop/create/base-create.vue';
import cardSku from '@/components/shop/create/cardSku/cardSku.vue';
import skuTable from '@/components/shop/create/cardSku/sku_table.vue';
import tinymce from '@/components/common/tinymce.vue';
export default {
	data() {
		return {
			createTabIndex: 0,
			msg: 'Welcome to Use Tinymce Editor',
		};
	},
	methods: {
		...mapMutations(['vModelState', 'skuAdd']),
		vmodel(key, val) {
			this.vModelState({ key, val });
		},
		// tab栏切换
		handleClick(tab, event) {
			// console.log(tab, event);
		},
		    // 鼠标单击的事件
		        onClick (e, editor) {
		            console.log('Element clicked')
		            console.log(e)
		            console.log(editor)
		        },
	},
	computed: {
		...mapState({
			rulesType: state => state.goods_create.rulesType,
			skuList: state => state.goods_create.skuList
		}),
		skuListTotal() {
			return this.skuList.length - 1;
		}
	},
	components: {
		single,
		baseCreate,
		cardSku,
		skuTable,
		tinymce
	}
};
</script>

<style>
.el-textarea__inner {
	height: 120px;
}
</style>
