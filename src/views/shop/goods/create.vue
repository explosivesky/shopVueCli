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
							<div class="" v-if="updateAllStatus === false" >
								<el-button type="text" v-for="(item,index) in btns" :key="index" @click="openUpdateAll(item)">{{item.name}}</el-button>
							</div>
							<div class="flex align-center" v-else>
								<el-input class="mr-3" ref="updateAllInput" v-model="updateAllValue" type="number" :placeholder="placeholderStatus" size="small" style="width: 180px;"></el-input>
								<el-button type="success" @click="updateAll" size="small">设置</el-button>
								<el-button type="danger" @click="closeUpdateAll" size="small">取消</el-button>
							</div>
						</el-form-item>
						<el-form-item label="规格设置">
							<!-- table表格 -->
							<sku-table ref="table"></sku-table>
						</el-form-item>
					</template>
					<!-- 单规格 -->
					<template v-else>
						<single />
					</template>
				</el-form>
			</el-tab-pane>

			<el-tab-pane label="商品属性">
				<goods-attrs/>
			</el-tab-pane>
			<el-tab-pane label="媒体设置">
				<media/>
			</el-tab-pane>
			<el-tab-pane label="商品详情">
				<!-- 富文本 -->
				<tinymce ref="editor" v-model="msg" @onClick="onClick" />
			</el-tab-pane>
			<el-tab-pane label="折扣设置">
				<el-form label-width="80px">
					<el-form-item label="会员价">
						<el-input :value="vipPrice" @input="vModelState({key:'vipPrice',val:$event})" class="w-25">
							<template slot="append">%</template>
						</el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
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
import media from '@/components/shop/create/media.vue';
import goodsAttrs from '@/components/shop/create/goodsAttrs.vue';
export default {
	data() {
		return {
			createTabIndex: 0,
			msg: 'Welcome to Use Tinymce Editor',
			updateAllValue:'',//绑定批量设置的值
			updateAllStatus:false,//控制批量设置
			placeholderStatus:'',
			btns:[{
				name:'销售价',
				key:'pprice'
			},
			{
				name:'市场价',
				key:'oprice'
			},
			{
				name:'成本价',
				key:'cprice'
			},
			{
				name:'库存',
				key:'stock'
			},
			{
				name:'体积',
				key:'volume'
			},
			{
				name:'重量',
				key:'weight'
			}],
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
		onClick(e, editor) {
			console.log('Element clicked');
			console.log(e);
			console.log(editor);
		},
		//打开批量设置
		openUpdateAll(item){
			this.placeholderStatus=item.name
			this.updateAllStatus=item.key
			this.$nextTick(()=>{
				this.$refs.updateAllInput.focus()
			})
		},
		//关闭批量设置
		closeUpdateAll(item){
			this.updateAllStatus=false
		},
		//批量设置
		updateAll(){
			//table组件 是根据 list 这个本地数据渲染的
			console.log(this.$refs.table)
			let list = this.$refs.table.list
			list.forEach(i=>{
				i[this.updateAllStatus]=this.updateAllValue
			})
			this.updateAllValue=''
			this.closeUpdateAll()
		}
	},
	computed: {
		...mapState({
			rulesType: state => state.goods_create.rulesType,
			skuList: state => state.goods_create.skuList,
			vipPrice: state => state.goods_create.vipPrice,
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
		tinymce,
		media,
		goodsAttrs
	}
};
</script>

<style>
.el-textarea__inner {
	height: 120px;
}
</style>
