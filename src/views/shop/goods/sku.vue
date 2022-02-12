<template>
	<div class="position-absolute px-4" style="top: 55px; left: 0; right: 0; bottom: 0;">
		<!-- 返回商品列表 -->
		<router-link :to="{ name: 'shop_goods_list' }" class="position-absolute" style="top: -43px; left: 170px;">
			<el-button icon="el-icon-arrow-left" size="mini">返回商品列表</el-button>
		</router-link>
		<!-- form表单 -->
		<el-form label-position="left" label-width="80px" class="mt-3">
			<el-form-item label="商品规格">
				<el-radio-group size="small" :value="skus_type" @input="vmodel('skus_type', $event)">
					<el-radio-button :label="0">多规格</el-radio-button>
					<el-radio-button :label="1">单一规格</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<!-- 多规格 -->
			<template v-if="!skus_type">
				<el-form-item label="添加规格">
					<!-- 卡片 -->
					<card-sku v-for="(s, s_i) in skuList" :key="s_i" :item="s" :index="s_i" :total="skuListTotal" :skuList="skuList" />
					<div><el-button size="mini" type="success" @click="skuAddEvent">添加规格</el-button></div>
				</el-form-item>
				<el-form-item label="批量设置">
					<div class="" v-if="updateAllStatus === false">
						<el-button type="text" v-for="(item, index) in btns" :key="index" @click="openUpdateAll(item)">{{ item.name }}</el-button>
					</div>
					<div class="flex align-center" v-else>
						<el-input
							class="mr-3"
							ref="updateAllInput"
							v-model="updateAllValue"
							type="number"
							:placeholder="placeholderStatus"
							size="small"
							style="width: 180px;"
						></el-input>
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
				<el-form-item label="市场价格" class="w-25">
					<el-input v-model="sku_value.oprice" type="text">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="销售价格" class="w-25">
					<el-input v-model="sku_value.pprice" type="text">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="成本价格" class="w-25">
					<el-input v-model="sku_value.cprice" type="text">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品重量" class="w-25">
					<el-input v-model="sku_value.weight" type="text">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
				<el-form-item label="商品体积" class="w-25">
					<el-input v-model="sku_value.volume" type="text">
						<template slot="append">
							元
						</template>
					</el-input>
				</el-form-item>
			</template>
		</el-form>
		<div class="position-fixed" style="bottom: 130px; right: 50px;"><el-button type="success" plain @click="onSubmit">提交</el-button></div>
	</div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import cardSku from '@/components/shop/create/cardSku/cardSku.vue';
import skuTable from '@/components/shop/create/cardSku/sku_table.vue';
export default {
	inject: ['layout'],
	data() {
		return {
			updateAllValue: '', //绑定批量设置的值
			updateAllStatus: false, //控制批量设置
			placeholderStatus: '',
			btns: [
				{
					name: '销售价',
					key: 'pprice'
				},
				{
					name: '市场价',
					key: 'oprice'
				},
				{
					name: '成本价',
					key: 'cprice'
				},
				{
					name: '库存',
					key: 'stock'
				},
				{
					name: '体积',
					key: 'volume'
				},
				{
					name: '重量',
					key: 'weight'
				}
			],
			id: 0,
			sku_value: {
				oprice: 0,
				pprice: 0,
				cprice: 0,
				weight: 0,
				volume: 0
			}
		};
	},
	created() {
		this.id = this.$route.params.id;
		if (!this.id) {
			this.$message({
				type: 'error',
				message: '非法参数'
			});
			return this.$router.push({
				name: 'shop_goods_list'
			});
		}
		this.layout.isLoading(true);
		new this.request(this.url.m(this.id).goods.read)
			.modeget()
			.then(res => {
				let data = res.data.data;
				let defaultVal = ['属性值', '#FFFFFF', '/favicon.ico'];
				// return
				//更新 card 组件数据
				this.vmodel(
					'skuList',
					data.goodsSkusCard.map(v => {
						v.list = v.goodsSkusCardValue;
						v.list.map(j => {
							j.text = v.type === 0 ? j.value : defaultVal[0];
							j.color = v.type === 1 ? j.value : defaultVal[1];
							j.image = v.type === 2 ? j.value : defaultVal[2];
							return j;
						});
						return v;
					})
				);
				//更新 sku_value 商品规格 0多规格 ： 1单规格
				this.vmodel('sku_value', data.sku_type ? data.sku_type : { oprice: 0, pprice: 0, cprice: 0, weight: 0, volume: 0 });
				//更新 table 数据
				this.$nextTick(() => {
					if (this.$refs.table) this.$refs.table.list = data.goodsSkus;
				});
				this.layout.isLoading(false);
			})
			.catch(e => {
				this.layout.isLoading(false);
			});
	},
	methods: {
		...mapMutations(['vModelState', 'skuAdd']),
		//保存提交
		onSubmit() {
			let list = this.$refs.table.list.map(v => {
				v.goods_id = v.id;
				return v;
			});
			this.layout.isLoading(true);
			new this.request(this.url.m(this.id).goods.updateskus, {
				sku_type: this.skus_type,
				sku_value: this.sku_value,
				goodsSkus: list
			})
				.modepost()
				.then(res => {
					this.$message.success('保存成功');
					this.$router.push({ name: 'shop_goods_list' });
					this.layout.isLoading(false);
				})
				.catch(e => {
					this.layout.isLoading(false);
				});
		},
		skuAddEvent() {
			//添加商品规格卡片
			this.layout.isLoading(true);
			new this.request(this.url.m().goods_skus_card.add_or_edit, {
				goods_id: this.id,
				name: '商品规格',
				order: 50,
				type: 0 //规格类型 0文字,1颜色,2图片
			})
				.modepost()
				.then(res => {
					let data = res.data.data;
					data.list = [];
					this.skuAdd(data);
					this.layout.isLoading(false);
				})
				.catch(e => {
					this.layout.isLoading(false);
				});
		},
		vmodel(key, val) {
			this.vModelState({ key, val });
		},
		//打开批量设置
		openUpdateAll(item) {
			this.placeholderStatus = item.name;
			this.updateAllStatus = item.key;
			this.$nextTick(() => {
				this.$refs.updateAllInput.focus();
			});
		},
		//关闭批量设置
		closeUpdateAll(item) {
			this.updateAllStatus = false;
		},
		//批量设置
		updateAll() {
			//table组件 是根据 list 这个本地数据渲染的
			let list = this.$refs.table.list;
			list.forEach(i => {
				i[this.updateAllStatus] = this.updateAllValue;
			});
			this.updateAllValue = '';
			this.closeUpdateAll();
		}
	},
	computed: {
		...mapState({
			skus_type: state => state.goods_create.skus_type,
			skuList: state => state.goods_create.skuList,
			vipPrice: state => state.goods_create.vipPrice
		}),
		skuListTotal() {
			return this.skuList.length - 1;
		}
	},
	components: {
		cardSku,
		skuTable
	}
};
</script>

<style></style>
