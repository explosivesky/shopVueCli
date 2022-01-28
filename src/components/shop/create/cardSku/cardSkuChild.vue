<template>
	<div class="border rounded py-1 px-2 input-group-sm position-relative mr-3 mb-3 flex justify-around align-center" style="width: 130px; height: 40px;">
		<!-- 删除 -->
		<span class="btn btn-light el-icon-circle-close p-0 rounded-circle border-0 position-absolute" style="right: -0.5em; top: -0.5em;" @click="delItem({subIndex,index})"></span>
		<!-- 颜色 -->
		<el-color-picker v-model="item.color" size="mini" v-if="type == 'color'" class="mr-2"></el-color-picker>
		<!-- 图片 -->
		<template v-if="type == 'img'">
			<div v-if="!item.image" class="el-icon-plus border btn btn-light flex justify-center align-center mr-2" style="width: 30px; height: 30px;" @click="openDialog"></div>
			<img v-else :src="item.image" @click="openDialog" class="mr-2 rounded" style="width: 30px; height: 30px; cursor: pointer; object-fit: cover;">
		</template>
		<!-- 按钮 -->
		<div class="btn btn-light w-75 pr-2 p-0" style="font-size: 15px;" @click="$emit('showIpt',index, subIndex,item.default)" v-show="!item.isShow">{{item.name}}</div>
		<!-- input -->
		<el-input ref="input" :value="item.name" @input="vModel($event,'name')" class="w-75" size="mini" v-show="item.isShow"></el-input>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex';
	export default{
		props:{
			type:String,
			item:Object,
			subIndex:Number,
			index:Number,
		},
		inject:['app']
		,
		methods:{
			...mapMutations(['editIsShow','delItem','updateIpt']),
			//打开图片列表dialog 弹窗
			openDialog(){
				this.app.openImgDialog((...res)=>{
					this.vModel(res[0].src,'image')
				},1)
			},
			vModel(val,type){
				console.log(val,type)
				this.updateIpt({index:this.index,subIndex:this.subIndex,val,type})
			}
		},
		watch:{
			item(newval){
				console.log(newval)
			}
		}
	}
</script>

<style>
</style>
