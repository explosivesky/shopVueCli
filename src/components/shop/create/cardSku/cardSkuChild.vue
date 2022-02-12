<template>
	<div class="border rounded px-1 input-group-sm position-relative mr-3 mb-3 flex justify-around justify-center align-center">
		<!-- 删除 -->
		<span class="btn btn-light el-icon-circle-close p-0 rounded-circle border-0 position-absolute" style="right: -0.5em; top: -0.5em;" @click="delItemEvent({subIndex,index})"></span>
		<!-- 颜色 -->
		<el-color-picker :value="item.color" size="mini" v-if="type == '1'" class="mr-2" @change="changeChoose"></el-color-picker>
		<!-- 图片 -->
		<template v-if="type == '2'">
			<div v-if="!item.image" class="el-icon-plus border btn btn-light flex justify-center align-center" style="width: 30px; height: 30px;" @click="openDialog"></div>
			<img v-else :src="item.image" @click="openDialog" class="rounded" style="width: 30px; height: 30px; cursor: pointer; object-fit: cover;">
		</template>
		<!-- input -->
		<el-input ref="input" :value="item.text" @input="vModel($event,'text')" style="width: 120px; height: 40px;" size="mini" v-if="type == '0'"></el-input>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default{
		inject:['app','layout'],
		props:{
			type:Number,
			item:Object,
			subIndex:Number,
			index:Number,
		},
		watch:{
			type(val){
				let key = ['text','color','image']
				let defaultVal = ['属性值','#FFFFFF','/favicon.ico'];
				this.item.value = this.item[key[val]] ? this.item[key[val]] : defaultVal[val]
				this.updateSkuEvent()
			}
		},
		methods:{
			...mapMutations(['editIsShow','delItem','updateIpt']),
			//删除规格项
			delItemEvent(subIndex,index){
				this.layout.isLoading(true)
				new this.request(this.url.m(this.item.id).goods_skus_card_value.delete).modepost().then(res=>{
					this.layout.isLoading(false)
					this.delItem(subIndex,index)
				}).catch((e=>{
					this.layout.isLoading(false)
				}))
			},
			//修改数据库的规格数据
			updateSkuEvent(){
				let key = ['text','color','image']
				//item.value  是 = text 属性的值还是 color 属性的值啊?
				this.item.value = this.item[key[this.item.type]]
				new this.request(this.url.m(this.item.id).goods_skus_card_value.add_or_edit,this.item).modepost().then(res=>{
					this.layout.isLoading(false)
				})
			},
			//打开图片列表dialog 弹窗
			openDialog(){
				this.app.openImgDialog((...res)=>{
					this.vModel(res[0].src,'image')
				},1)
			},
			vModel(val,type){
				this.updateSkuEvent()
				this.updateIpt({index:this.index,subIndex:this.subIndex,val,type})
			},
			changeChoose(val){
				this.vModel(val,'color')
			}
		}
	}
</script>

<style scoped="scoped">
	::v-deep .el-input--mini .el-input__inner{
		height: 39px;
		line-height: 39px;
	}
</style>
