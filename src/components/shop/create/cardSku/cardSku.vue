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
					<el-radio label="default" class="mb-0">无</el-radio>
					<el-radio label="color" class="mb-0">颜色</el-radio>
					<el-radio label="img" class="mb-0">图片</el-radio>
				</el-radio-group>
				<el-button icon="el-icon-top" size="mini" :disabled="index === 0" @click="sortUp('sortUp',skuList,index)" class="ml-auto"></el-button>
				<el-button icon="el-icon-bottom" size="mini" :disabled="total === index" @click="sortSkuFn('sortDown',skuList,index)"></el-button>
				<el-button size="mini" type="text" @click="skuDelete(index)">删除</el-button>
			</div>
			<div class="card-body">
				<!-- 子选项 -->
				<div class="flex flex-wrap">
					<card-sku-child v-for="(l, l_i) in item.list" :key="l_i" :type="item.type" :item="l" :index="index" :subIndex="l_i" :ref="l.default" @showIpt="showIpt" v-dragging="{ item: l, list: list, group:`skuItem${index}`}"/>
				</div>
				<el-button size="mini" type="text" icon="el-icon-plus" @click="callRuleItem(item.type, index)">添加规格项</el-button>
				</div>
			</div>
		</div>
	
	</div>
</template>

<script>
import { mapMutations ,mapState,mapGetters} from 'vuex';
import cardSkuChild from './cardSkuChild.vue'
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
	inject:['app']
	,
	methods: {
		...mapMutations(['skuDelete', 'vModelSku', 'sortSku', 'addRuleItem','editIsShow','sortCardItem']),
		Vmodel(key, val, index) {
			this.vModelSku({ key, val, index });
		},
		callRuleItem(type, index) {
			this.addRuleItem({ type, index });
		},
		//显示输入框
		showIpt(index, subIndex, ref) {
			this.editIsShow({index, subIndex, ref });
			this.$nextTick(() => {
				//根据 ref 调用 focus
				this.$refs[ref][0].$refs.input.focus()
			});
		},
		//card组件 排序
		sortUp(type,arr,index){
			this.sortSku({type,arr,index})
			
		},
		sortDown(type,arr,index){
			this.sortSku({type,arr,index})
		},
		//sku_dialog
		openDialog(){
			this.app.openSkuDialog(res=>{
				this.Vmodel('name',res.name,this.index)
				this.Vmodel('type',res.type,this.index)
				this.Vmodel('list',res.list,this.index)
			})
		}
	},
	components: {
		cardSkuChild
	},
	  mounted () {
		  this.$watch('item.list',(newval,oldval)=>{
			  this.list=newval
		  })
		  //拖拽过程钩子
		  this.list=this.sortSkuList[this.index].list
	    // this.$dragging.$on('dragged', ({ value }) => {
	      // console.log(value.item)
	      // console.log(value.list)
	      // console.log(value.otherData)
	    // })
		//拖拽结束钩子
	    this.$dragging.$on('dragend', (e) => {
			if(e.group=='skuItem'+this.index){
					this.sortCardItem({index:this.index,arr:this.list})
			}

	    })
	  },
	  computed:{
		  ...mapGetters(['getSkuList']),
		  ...mapState({
			  sortSkuList:state=>state.goods_create.skuList
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
