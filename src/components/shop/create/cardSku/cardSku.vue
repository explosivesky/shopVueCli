<!--
 * @Author: your name
 * @Date: 2022-01-24 17:36:47
 * @LastEditTime: 2022-01-24 19:26:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \shopProduct\shopvuecli\src\components\shop\create\cardSku\cardSku.vue
-->
<template>
	<div>
		<div class="card mb-3">
			<div class="card-header flex align-center">
				<span>规格项 :</span>
				<el-input :value="item.name" @input="Vmodel('name', $event, index)" style="width: 20%; margin-left: 10px;" size="small">
					<el-button slot="append" icon="el-icon-more" size="mini" @click="openDialog"></el-button>
				</el-input>
				<el-radio-group :value="item.type" @input="Vmodel('type', $event, index)" size="small" class="ml-2">
					<el-radio :label="0" class="mb-0">文字</el-radio>
					<el-radio :label="1" class="mb-0">颜色</el-radio>
					<el-radio :label="2" class="mb-0">图片</el-radio>
				</el-radio-group>
				<el-button icon="el-icon-top" size="mini" :disabled="index === 0" @click="skuSort('sortUp',skuList,index)" class="ml-auto"></el-button>
				<el-button icon="el-icon-bottom" size="mini" :disabled="total === index" @click="skuSort('sortDown',skuList,index)"></el-button>
				<el-button size="mini" type="text" @click="skuDeleteEvent()">删除</el-button>
			</div>
			<div class="card-body">
				<!-- 子选项 -->
				<div class="flex flex-wrap">
					<card-sku-child v-for="(l, l_i) in item.list" :key="l_i" :type="item.type" :item="l" :index="index" :subIndex="l_i" :ref="l.default" @showIpt="showIpt" v-dragging="{ item: l, list: list, group:`skuItem${index}`}"/>
				</div>
				<el-button size="mini" type="text" icon="el-icon-plus" @click="addRuleItemEvent()">添加规格项</el-button>
				</div>
			</div>
		</div>
	
	</div>
</template>

<script>
import { mapMutations ,mapState,mapGetters} from 'vuex';
import cardSkuChild from './cardSkuChild.vue'
let defaultVal = ['属性值','#FFFFFF','/favicon.ico'];
export default {
	props:{
		item:Object,
		index:Number,
		total:Number,
		skuList:Array,
	},
	data() {
		return {
			list:this.item.list,
			subIndex:this.index
		};
	},
	inject:['app','layout'],
	methods: {
		...mapMutations(['skuDelete', 'vModelSku', 'sortSku', 'addRuleItem','editIsShow','sortCardItem','deafultInc']),
		//更新 sku_card 状态
		updateSku(){
			new this.request(this.url.m(this.item.id).goods_skus_card.add_or_edit,this.item).modepost()
		},
		//每次修改时都会调用这个方法
		Vmodel(key, val, index) {
			this.updateSku()
			this.vModelSku({ key, val, index });
		},
		//删除 sku_card 卡片
		skuDeleteEvent(){
			new this.request(this.url.m(this.item.id).goods_skus_card.delete).modepost().then(res=>{
				this.skuDelete(this.index)
			})
		},
		//添加规格项
		addRuleItemEvent(val=false){
			new this.request(this.url.m().goods_skus_card_value.add_or_edit,{
				goods_skus_card_id:this.item.id,
				name:this.item.name,
				order:50,
				value:typeof val === 'string' ? val: defaultVal[this.item.type],
			}).modepost().then(res=>{
				let data = res.data.data
				data.text= this.item.type === 0 ? data.value : defaultVal[0]
				data.color=this.item.type === 1 ? data.value : defaultVal[1]
				data.image=this.item.type === 2 ? data.value : defaultVal[2]
				this.addRuleItem({ data, index:this.index });
			})
		},
		//显示输入框
		showIpt(index, subIndex, ref) {
			this.editIsShow({index, subIndex, ref });
			// this.$nextTick(() => {
				//根据 ref 调用 focus
				// this.$refs[ref][0].$refs.input.focus()
			// });
		},
		//card组件 排序
		skuSort(type,arr,index){
			new this.request(this.url.m(this.item.id).goods_skus_card_value.sort,{
				sortdata:this.list.map((v,i)=>{
					return{
						id:v.id,
						order:i+1
					}
				})
			}).modepost().then(res=>{
				this.sortSku({type,arr,index})
			})
		},
		//sku_dialog
		openDialog(){
			this.app.openSkuDialog(res=>{
				this.Vmodel('name',res.name,this.index)
				this.Vmodel('type',res.type,this.index)
				res.list.forEach(v=>{
					this.addRuleItemEvent(v.name)
				})
			})
		}
	},
	components: {
		cardSkuChild
	},
	  mounted () {
		  //拖拽排序后更新传进拖拽排序里面的值
		  this.$watch('item.list',(newval,oldval)=>{
			  this.list=newval
		  })
		  //拖拽过程钩子
		  this.list=this.sortSkuList[this.index].list
		//拖拽结束钩子
	    this.$dragging.$on('dragend', (e) => {
			//防止多次调用
			if(e.group=='skuItem'+this.index){
				new this.request(this.url.m(this.item.id).goods_skus_card_value.sort,{
					sortdata:this.sortSkuList.map((v,i)=>{
						return{
							id:v.id,
							order:i+1
						}
					})
				}).modepost().then(res=>{
					this.sortCardItem({index:this.index,arr:this.list})
				})
			}

	    })
	  },
	  computed:{
		  ...mapState({
			  sortSkuList:state=>state.goods_create.skuList,
			  default:state=>state.goods_create.default
		  })
	  }
};
</script>

<style scoped="scoped">
::v-deep .el-input__inner {
	text-align: center;
	padding: 0 !important;
}
</style>
